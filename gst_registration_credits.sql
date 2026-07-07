-- ==========================================
-- GST REGISTRATION ATOMIC CREDIT BURNING
-- ==========================================

-- 1. Insert configurations for the GST Registration stages
INSERT INTO public.credit_configuration (action_key, action_name, credit_cost) VALUES
('reg_started', 'Registration Started', 1),
('reg_business_details', 'Business Details Saved', 2),
('reg_promoter_partners', 'Promoter / Partner Details Saved', 2),
('reg_auth_signatory', 'Authorized Signatory Saved', 1),
('reg_principal_place', 'Principal Place of Business Saved', 1),
('reg_additional_place', 'Additional Place of Business Saved', 1),
('reg_goods_services', 'Goods & Services (HSN/SAC) Saved', 2),
('reg_bank_accounts', 'Bank Account Details Saved', 1),
('reg_documents', 'Document Upload Completed', 2),
('reg_verification', 'Verification Completed', 2),
('reg_final_submission', 'Final GST Registration Submitted', 10)
ON CONFLICT (action_key) DO UPDATE SET credit_cost = EXCLUDED.credit_cost;

-- 2. Create the Atomic RPC Function for saving tabs
CREATE OR REPLACE FUNCTION atomic_save_tab_and_burn(
    p_user_id UUID,
    p_trn TEXT,
    p_tab_name TEXT,
    p_tab_data JSONB,
    p_action_key TEXT
) RETURNS JSONB AS $$
DECLARE
    v_cost INT;
    v_balance INT;
    v_action_name TEXT;
    v_current_data JSONB;
BEGIN
    -- 1. Check Credits
    SELECT credit_cost, action_name INTO v_cost, v_action_name 
    FROM public.credit_configuration WHERE action_key = p_action_key;
    
    IF v_cost IS NULL THEN
        -- Default to 0 cost if not configured
        v_cost := 0;
        v_action_name := p_tab_name;
    END IF;

    -- Only deduct if cost > 0
    IF v_cost > 0 THEN
        SELECT remaining_credits INTO v_balance FROM public.student_credits WHERE user_id = p_user_id FOR UPDATE;
        IF v_balance < v_cost THEN 
            RAISE EXCEPTION 'INSUFFICIENT_CREDITS'; 
        END IF;

        -- Deduct credits
        UPDATE public.student_credits 
        SET remaining_credits = remaining_credits - v_cost, 
            used_credits = used_credits + v_cost 
        WHERE user_id = p_user_id;

        -- Audit log
        INSERT INTO public.audit_logs (user_id, action_type, module, credits_burned, balance_after, status) 
        VALUES (p_user_id, v_action_name, p_trn, v_cost, v_balance - v_cost, 'success');
    END IF;

    -- 2. Upsert Tab Data into form_tabs_data
    SELECT form_tabs_data INTO v_current_data FROM public.business_details WHERE trn = p_trn;
    
    IF v_current_data IS NULL THEN
        v_current_data := '{}'::jsonb;
    END IF;

    -- Merge the new tab data
    v_current_data := jsonb_set(v_current_data, ARRAY[p_tab_name], p_tab_data, true);

    INSERT INTO public.business_details (trn, form_tabs_data, updated_at)
    VALUES (p_trn, v_current_data, NOW())
    ON CONFLICT (trn) DO UPDATE 
    SET form_tabs_data = EXCLUDED.form_tabs_data, updated_at = EXCLUDED.updated_at;

    RETURN jsonb_build_object('success', true, 'cost', v_cost, 'remaining_credits', v_balance - v_cost);
END;
$$ LANGUAGE plpgsql;


-- 3. Create the Atomic RPC Function for saving base business details
CREATE OR REPLACE FUNCTION atomic_save_business_details_and_burn(
    p_user_id UUID,
    p_trn TEXT,
    p_payload JSONB,
    p_action_key TEXT
) RETURNS JSONB AS $$
DECLARE
    v_cost INT;
    v_balance INT;
    v_action_name TEXT;
BEGIN
    -- 1. Check Credits
    SELECT credit_cost, action_name INTO v_cost, v_action_name 
    FROM public.credit_configuration WHERE action_key = p_action_key;
    
    IF v_cost IS NULL THEN
        v_cost := 0;
        v_action_name := 'Business Details Base';
    END IF;

    -- Only deduct if cost > 0
    IF v_cost > 0 THEN
        SELECT remaining_credits INTO v_balance FROM public.student_credits WHERE user_id = p_user_id FOR UPDATE;
        IF v_balance < v_cost THEN 
            RAISE EXCEPTION 'INSUFFICIENT_CREDITS'; 
        END IF;

        UPDATE public.student_credits 
        SET remaining_credits = remaining_credits - v_cost, 
            used_credits = used_credits + v_cost 
        WHERE user_id = p_user_id;

        INSERT INTO public.audit_logs (user_id, action_type, module, credits_burned, balance_after, status) 
        VALUES (p_user_id, v_action_name, p_trn, v_cost, v_balance - v_cost, 'success');
    END IF;

    -- 2. Upsert Base Business Details
    INSERT INTO public.business_details (
        trn, legal_name, pan, state_name, trade_name, additional_trade, 
        constitution, district, casual_taxable, composition, rule_14a, 
        reason, commencement_date, liability_date, updated_at, email, mobile
    )
    VALUES (
        p_trn, 
        p_payload->>'legalName', 
        p_payload->>'pan', 
        p_payload->>'stateName', 
        p_payload->>'tradeName', 
        p_payload->>'additionalTrade', 
        p_payload->>'constitution', 
        p_payload->>'district', 
        COALESCE((p_payload->>'casualTaxable')::BOOLEAN, false), 
        COALESCE((p_payload->>'composition')::BOOLEAN, false), 
        p_payload->>'rule14A', 
        p_payload->>'reason', 
        p_payload->>'commencementDate', 
        p_payload->>'liabilityDate', 
        NOW(),
        p_payload->>'email',
        p_payload->>'mobile'
    )
    ON CONFLICT (trn) DO UPDATE SET 
        legal_name = EXCLUDED.legal_name,
        pan = EXCLUDED.pan,
        state_name = EXCLUDED.state_name,
        trade_name = EXCLUDED.trade_name,
        additional_trade = EXCLUDED.additional_trade,
        constitution = EXCLUDED.constitution,
        district = EXCLUDED.district,
        casual_taxable = EXCLUDED.casual_taxable,
        composition = EXCLUDED.composition,
        rule_14a = EXCLUDED.rule_14a,
        reason = EXCLUDED.reason,
        commencement_date = EXCLUDED.commencement_date,
        liability_date = EXCLUDED.liability_date,
        email = COALESCE(EXCLUDED.email, business_details.email),
        mobile = COALESCE(EXCLUDED.mobile, business_details.mobile),
        updated_at = NOW();

    RETURN jsonb_build_object('success', true, 'cost', v_cost, 'remaining_credits', v_balance - v_cost);
END;
$$ LANGUAGE plpgsql;
