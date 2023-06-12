const { fetch, fetchALL } = require("../../lib/postgres");

const FOUND_APP = `
    SELECT 
        *
    FROM   
        apps_side
    WHERE
        $1 = ANY (banner_id) or
        $1 = ANY (inters_id) or
        $1 = ANY (rewarded_id) or 
        $1 = ANY (native_banner_id);
`;

const FOUND_ADS = `
    SELECT
       *
    FROM
        advertisements
    WHERE
       campaign_id = $1;
`;

const FOUND_CAMPAIGN = `
    SELECT
        *, to_char(action_result_create_date at time zone 'Asia/Tashkent', 'HH24,MM,DD')::INT
    FROM
        action_result_campaign
    WHERE
        campaign_id = $1
    ORDER BY
        action_result_create_date DESC
    LIMIT 1;
`;

const FOUND_APP_RESULT = `
    SELECT
        *, to_char(action_result_create_date at time zone 'Asia/Tashkent', 'HH24,MM,DD')::INT
    FROM
        action_result
    WHERE
        app_ads_id = $1
    ORDER BY
        action_result_create_date DESC
    LIMIT 1;
`;

const UPDATE_CTR = `
    UPDATE
        action_result_campaign
    SET
        campaign_ctr = $2
    WHERE
        action_result_id = $1
    RETURNING *;
`;

const ADD_CAMPAIGN_VIEW = `
    INSERT INTO 
        action_result_campaign (
            action_result_time,
            campaign_id,
            action_earning,
            user_id,
            views_count
        )
    VALUES (
        $1,
        $2,
        $3,
        ARRAY [$4],
        1
    )
    RETURNING *;
`

const ADD_CAMPAIGN_CLICK = `
    INSERT INTO 
        action_result_campaign (
            action_result_time,
            campaign_id,
            action_earning,
            user_id,
            clicks_count
        )
    VALUES (
        $1,
        $2,
        $3,
        ARRAY [$4],
        1
    )
    RETURNING *;
`

const ADD_CAMPAIGN_FULL_VIEW = `
    INSERT INTO 
        action_result_campaign (
            action_result_time,
            campaign_id,
            action_earning,
            user_id,
            full_views_count
        )
    VALUES (
        $1,
        $2,
        $3,
        ARRAY [$4],
        1
    )
    RETURNING *;
`

const UPDATE_CAMPAIGN_VIEW = `
    UPDATE
        action_result_campaign
    SET
        action_earning = action_earning + $2,
        user_id = ARRAY_APPEND(user_id, $3),
        views_count = views_count + 1
    WHERE
        campaign_id = $1
    RETURNING *;
`

const UPDATE_CAMPAIGN_CLICK = `
    UPDATE
        action_result_campaign
    SET
        action_earning = action_earning + $2,
        user_id = ARRAY_APPEND(user_id, $3),
        clicks_count = clicks_count + 1
    WHERE
        campaign_id = $1
    RETURNING *;
`
const UPDATE_CAMPAIGN_FULL_VIEW = `
    UPDATE
        action_result_campaign
    SET
        action_earning = action_earning + $2,
        user_id = ARRAY_APPEND(user_id, $3),
        full_views_count = full_views_count + 1
    WHERE
        campaign_id = $1
    RETURNING *;
`

const ADD_APP_RESULT_VIEW = `
    INSERT INTO 
        action_result (
            action_result_time,
            app_ads_id,
            action_earning,
            user_id,
            views_count
        )
    VALUES (
        $1,
        $2,
        $3,
        ARRAY [$4],
        1
    )
    RETURNING *;
`

const ADD_APP_RESULT_CLICK = `
    INSERT INTO 
        action_result (
            action_result_time,
            app_ads_id,
            action_earning,
            user_id,
            clicks_count
        )
    VALUES (
        $1,
        $2,
        $3,
        ARRAY [$4],
        1
    )
    RETURNING *;
`

const ADD_APP_RESULT_FULL_VIEW = `
    INSERT INTO 
        action_result (
            action_result_time,
            app_ads_id,
            action_earning,
            user_id,
            full_views_count
        )
    VALUES (
        $1,
        $2,
        $3,
        ARRAY [$4],
        1
    )
    RETURNING *;
`

const UPDATE_APP_RESULT_VIEW = `
    UPDATE
        action_result
    SET
        action_earning = action_earning + $2,
        user_id = ARRAY_APPEND(user_id, $3),
        views_count = views_count + 1
    WHERE
        app_ads_id = $1
    RETURNING *;
`

const UPDATE_APP_RESULT_CLICK = `
    UPDATE
        action_result
    SET
        action_earning = action_earning + $2,
        user_id = ARRAY_APPEND(user_id, $3),
        clicks_count = clicks_count + 1
    WHERE
        app_ads_id = $1
    RETURNING *;
`

const UPDATE_APP_RESULT_FULL_VIEW = `
    UPDATE
        action_result
    SET
        action_earning = action_earning + $2,
        user_id = ARRAY_APPEND(user_id, $3),
        full_views_count = full_views_count + 1
    WHERE
        app_ads_id = $1
    RETURNING *;
`

const ACTION_RESULT_CAMPAIGN = `
    SELECT 
        campaign_id, 
        sum(views_count)::int as views, 
        sum(clicks_count)::int as click, 
        sum(full_views_count)::int as full_views
    FROM 
        action_result_campaign 
    group by 
        campaign_id;
`;

const UPDATE_ADS_COUNT = `
    Update 
        advertisements 
    SET 
        view = array_append(view, $2),
        click = array_append(click, $3),
        full_view = array_append(full_view, $4)
    WHERE
        campaign_id = $1
    RETURNING *;
`;

const foundApp = (app_ads_id) => fetch(FOUND_APP, app_ads_id)
const foundAds = (campaign_id) => fetch(FOUND_ADS, campaign_id)
const foundCampaign = (campaign_id) => fetch(FOUND_CAMPAIGN, campaign_id)
const foundAppResult = (app_ads_id) => fetch(FOUND_APP_RESULT, app_ads_id)
const updateCampaignCtr = (campaign_id, calculateCTR) => fetch(UPDATE_CTR, campaign_id, calculateCTR)
const addCampaignResultView = (time, campaign_id, price, user_id) => fetch(ADD_CAMPAIGN_VIEW, time, campaign_id, price, user_id)
const addCampaignResultClick = (time, campaign_id, price, user_id) => fetch(ADD_CAMPAIGN_CLICK, time, campaign_id, price, user_id)
const addCampaignResultFullView = (time, campaign_id, price, user_id) => fetch(ADD_CAMPAIGN_FULL_VIEW, time, campaign_id, price, user_id)
const updateCampaignResultView = (campaign_id, price, user_id) => fetch(UPDATE_CAMPAIGN_VIEW, campaign_id, price, user_id)
const updateCampaignResultClick = (campaign_id, price, user_id) => fetch(UPDATE_CAMPAIGN_CLICK, campaign_id, price, user_id)
const updateCampaignResultFullView = (campaign_id, price, user_id) => fetch(UPDATE_CAMPAIGN_FULL_VIEW, campaign_id, price, user_id)
const addAppResultView = (time, app_ads_id, price, user_id) => fetch(ADD_APP_RESULT_VIEW, time, app_ads_id, price, user_id)
const addAppResultClick = (time, app_ads_id, price, user_id) => fetch(ADD_APP_RESULT_CLICK, time, app_ads_id, price, user_id)
const addAppResultFullView = (time, app_ads_id, price, user_id) => fetch(ADD_APP_RESULT_FULL_VIEW, time, app_ads_id, price, user_id)
const updateAppResultView = (app_ads_id, price, user_id) => fetch(UPDATE_APP_RESULT_VIEW, app_ads_id, price, user_id)
const updateAppResultClick = (app_ads_id, price, user_id) => fetch(UPDATE_APP_RESULT_CLICK, app_ads_id, price, user_id)
const updateAppResultFullView = (app_ads_id, price, user_id) => fetch(UPDATE_APP_RESULT_FULL_VIEW, app_ads_id, price, user_id)
const actionResultCampaign = () => fetchALL(ACTION_RESULT_CAMPAIGN)
const updateAdsCount = (id, view, click, fullView) => fetch(UPDATE_ADS_COUNT, id, view, click, fullView)

module.exports = {
    foundApp,
    foundAds,
    foundCampaign,
    foundAppResult,
    updateCampaignCtr,
    addCampaignResultView,
    addCampaignResultClick,
    addCampaignResultFullView,
    updateCampaignResultView,
    updateCampaignResultClick,
    updateCampaignResultFullView,
    addAppResultView,
    addAppResultClick,
    addAppResultFullView,
    updateAppResultView,
    updateAppResultClick,
    updateAppResultFullView,
    actionResultCampaign,
    updateAdsCount
}