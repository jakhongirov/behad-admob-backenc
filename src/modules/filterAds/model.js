const { fetch, fetchALL } = require("../../lib/postgres");

const FOUND_USER = `
    SELECT
        *, to_char(user_create_date at time zone 'Asia/Tashkent', 'HH24:MI/DD.MM.YYYY')
    FROM
        users
    WHERE
        $1 = ANY (user_device_id);
`;

const CHOOSE_ALL = `
    SELECT
        *
    FROM
        advertisements
    WHERE  
        advertisement_type = $1 and advertisement_active = true and $2 = any (advertisement_app_id)
    ORDER BY random()
    LIMIT 1;
`;

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

const UPDATE_STATUS_AD = `
    UPDATE 
        advertisements
    SET
        advertisement_active = false
    WHERE
        campaign_id =  $1
    RETURNING *;
`;

const FOUND_APP_RESULT = `
    SELECT
        *, to_char(action_result_create_date at time zone 'Asia/Tashkent', 'HH24,MM,DD') as date
    FROM
        action_result
    WHERE
        app_ads_id = $1
    ORDER BY
        action_result_create_date DESC
    LIMIT 1;
`;

const ADD_APP_RESULT_REQUEST = `
    INSERT INTO 
        action_result (
            action_result_time,
            app_ads_id,
            user_id,
            request_count
        )
    VALUES (
        $1,
        $2,
        ARRAY [$3],
        1
    )
    RETURNING *;
`

const UPDATE_APP_RESULT_REQUEST = `
    UPDATE
        action_result
    SET
        user_id = ARRAY_APPEND(user_id, $2),
        request_count = request_count + 1
    WHERE
        app_ads_id = $1
    RETURNING *;
`

const foundUser = (deviceId) => fetch(FOUND_USER, deviceId)
const foundAd = (age, who, country, city, phone_lang, type, app_id) => {
    const FOUND_AD = `
        SELECT 
            *
        FROM
            advertisements
        WHERE
            advertisement_active = true and
            advertisement_type = '${type}' and
            ( gender ilike '%${who}%' or gender = 'all' ) and 
            ( max_age >= ${age} or ${age} >= min_age ) and
            ( country ilike '%${country}%' or country = 'all' ) and
            ( city ilike '%${city}%' or city = 'all' ) and
            ( phone_lang ilike '%${phone_lang}%' or phone_lang = 'all' ) and
            ( ${Number(app_id)} = any (advertisement_app_id))
        ORDER BY random()
        LIMIT 1;
    `;

    return fetch(FOUND_AD)
}
const chooseAllAd = (type, app_id) => fetch(CHOOSE_ALL, type, app_id)
const foundApp = (adId) => fetch(FOUND_APP, adId)
const foundAppResult = (adId) => fetch(FOUND_APP_RESULT, adId)
const updateStatusAd = (campaign_id) => fetch(UPDATE_STATUS_AD, campaign_id)
const addAppResultRequest = (time, adId, user_id) => fetch(ADD_APP_RESULT_REQUEST, time, adId, user_id)
const updateAppResultRequest = (adId, user_id) => fetch(UPDATE_APP_RESULT_REQUEST, adId, user_id)

module.exports = {
    foundUser,
    foundAd,
    chooseAllAd,
    foundApp,
    updateStatusAd,
    addAppResultRequest,
    updateAppResultRequest,
    foundAppResult
}