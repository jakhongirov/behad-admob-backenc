const { fetch, fetchALL } = require("../../lib/postgres");

const FOUND_USER = `
   SELECT 
      *
   FROM
      users_ads
   WHERE
      user_id = $1;
`;

const FOUND_AD = `
   SELECT
      *
   FROM
      advertisements
   WHERE
      campaign_id = $1 and advertising_id = $2;
`;

const foundUser = (userId) => fetch(FOUND_USER, userId)
const foundAd = (campaignId, userId) => fetch(FOUND_AD, campaignId, userId)
const foundCampaignActions = (campaignId, limit, offset) => {
   const FOUND_CAMPAIGN_ACTIONS = `
      SELECT
         action_result_id,
         action_result_time,
         views_count,
         clicks_count,
         full_views_count,
         campaign_ctr,
         action_earning,
         to_char(action_result_create_date, 'MON-DD-YYYY HH12:MIPM') as date
      FROM
         action_result_campaign
      WHERE
         campaign_id = $1
      ORDER BY
         action_result_create_date DESC
      LIMIT ${limit ? limit : 10}
      OFFSET ${offset ? offset : 0};
`;

   return fetchALL(FOUND_CAMPAIGN_ACTIONS, campaignId)
}
const calculateActionCampaign = (userId, days) => {
   const CALCULATE_ACTION_CAMPAIGN = `
      SELECT
         sum(a.views_count) as views, 
         sum(a.clicks_count) as clicks, 
         sum(a.full_views_count) as full_view, 
         avg(a.campaign_ctr) as ctr,
         sum(action_earning) as earning
      FROM
         action_result_campaign a
      INNER JOIN
         advertisements b
      ON 
         a.campaign_id = b.campaign_id 
      WHERE 
         advertising_id = $1 and
         action_result_create_date > current_date - interval '${days} days';
   `;
   return fetch(CALCULATE_ACTION_CAMPAIGN, userId)
}
const calculateActionCampaignById = (userId, campaignId, days) => {
   const CALCULATE_ACTION_CAMPAIGN = `
      SELECT
         sum(a.views_count) as views, 
         sum(a.clicks_count) as clicks, 
         sum(a.full_views_count) as full_view, 
         avg(a.campaign_ctr) as ctr,
         sum(action_earning) as earning
      FROM
         action_result_campaign a
      INNER JOIN
         advertisements b
      ON 
         a.campaign_id = b.campaign_id 
      WHERE 
         advertising_id = $1 and
         campaign_id = $2 and
         action_result_create_date > current_date - interval '${days} days';
   `;
   return fetch(CALCULATE_ACTION_CAMPAIGN, userId, campaignId)
}
const actionListByCampaignId = (userId, campaignId, days) => {
   const ACTION_CAMPAIGN_LIST_BY_ID = `
      SELECT
         action_result_id,
         action_result_time,
         views_count,
         clicks_count,
         full_views_count,
         campaign_ctr,
         action_earning,
         to_char(action_result_create_date, 'MON-DD-YYYY HH12:MIPM') as date
      FROM
         action_result_campaign a
      INNER JOIN
         advertisements b
      ON 
         a.campaign_id = b.campaign_id 
      WHERE 
         advertising_id = $1 and
         campaign_id = $2 and
         action_result_create_date > current_date - interval '${days} days';
   `;
   return fetch(ACTION_CAMPAIGN_LIST_BY_ID, userId, campaignId)
}
const actionList = (userId, days) => {
   const ACTION_CAMPAIGN_LIST = `
      SELECT
         action_result_id,
         action_result_time,
         views_count,
         clicks_count,
         full_views_count,
         campaign_ctr,
         action_earning,
         to_char(action_result_create_date, 'MON-DD-YYYY HH12:MIPM') as date
      FROM
         action_result_campaign a
      INNER JOIN
         advertisements b
      ON 
         a.campaign_id = b.campaign_id 
      WHERE 
         advertising_id = $1 and
         action_result_create_date > current_date - interval '${days} days';
   `;
   return fetch(ACTION_CAMPAIGN_LIST, userId)
}

module.exports = {
   foundUser,
   calculateActionCampaign,
   foundAd,
   calculateActionCampaignById,
   foundCampaignActions,
   actionListByCampaignId,
   actionList
}