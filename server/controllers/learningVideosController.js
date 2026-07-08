const axios = require('axios');
const supabaseAdmin = require('../config/supabaseAdmin');

// Helper to extract video ID and build thumbnail & title
async function extractYouTubeInfo(url) {
  // Supported formats regex
  const regex = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/i;
  const match = url.match(regex);
  if (!match) {
    throw new Error('Invalid YouTube URL');
  }
  const videoId = match[1];
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  let title = 'Untitled Video';
  try {
    const oembedRes = await axios.get('https://www.youtube.com/oembed', {
      params: { url, format: 'json' },
      timeout: 5000,
    });
    if (oembedRes.data && oembedRes.data.title) {
      title = oembedRes.data.title;
    }
  } catch (e) {
    // ignore, keep default title
  }
  return { videoId, thumbnail, title };
}

// GET all videos
exports.getAllVideos = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('learning_videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, videos: data });
  } catch (err) {
    console.error('GET learning videos error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};

// POST create video (admin only)
exports.createVideo = async (req, res) => {
  const { youtube_url } = req.body;
  if (!youtube_url) {
    return res.status(400).json({ success: false, message: 'youtube_url is required' });
  }
  try {
    const { videoId, thumbnail, title } = await extractYouTubeInfo(youtube_url);
    const { data, error } = await supabaseAdmin.from('learning_videos')
      .insert({
        title,
        video_id: videoId,
        youtube_url,
        thumbnail,
        category: 'gst',
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, video: data });
  } catch (err) {
    console.error('Create video error:', err);
    const msg = err.message.includes('Invalid YouTube') ? err.message : 'Failed to create video';
    res.status(400).json({ success: false, message: msg });
  }
};

// PUT update video (admin only)
exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { youtube_url } = req.body;
  if (!youtube_url) {
    return res.status(400).json({ success: false, message: 'youtube_url is required' });
  }
  try {
    const { videoId, thumbnail, title } = await extractYouTubeInfo(youtube_url);
    const { data, error } = await supabaseAdmin.from('learning_videos')
      .update({
        title,
        video_id: videoId,
        youtube_url,
        thumbnail,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, video: data });
  } catch (err) {
    console.error('Update video error:', err);
    const msg = err.message.includes('Invalid YouTube') ? err.message : 'Failed to update video';
    res.status(400).json({ success: false, message: msg });
  }
};

// DELETE video (admin only)
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin.from('learning_videos')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    console.error('Delete video error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};
