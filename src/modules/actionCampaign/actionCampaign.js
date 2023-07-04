const model = require('./model')

module.exports = {
   CALCULATE_ACTION_CAMPAIGN: async () => {
      try {
         const { userId, campaignId, days } = req.query

         if (campaignId && userId) {
            const foundAd = await model.foundAd(campaignId, userId)

            if (foundAd) {
               const calculateActionCampaignById = await model.calculateActionCampaignById(userId, campaignId, days)

               if (calculateActionCampaignById) {
                  return res.json({
                     status: 200,
                     message: "Success",
                     data: calculateActionCampaignById
                  })
               } else {
                  return res.json({
                     status: 400,
                     message: "Bad request"
                  })
               }
            } else {
               return res.json({
                  status: 404,
                  message: "User not found"
               })
            }
         } else if (userId) {
            const foundUser = await model.foundUser(userId)

            if (foundUser) {
               const calculateActionCampaign = await model.calculateActionCampaign(userId, days)

               if (calculateActionCampaign) {
                  return res.json({
                     status: 200,
                     message: "Success",
                     data: calculateActionCampaign
                  })
               } else {
                  return res.json({
                     status: 400,
                     message: "Bad request"
                  })
               }
            } else {
               return res.json({
                  status: 404,
                  message: "User not found"
               })
            }
         } else {
            return res.json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   CAMPAIGN_ACTIONS: async (req, res) => {
      try {
         const { campaignId, userId, limit, offset } = req.query

         if (campaignId && userId) {
            const foundAd = await model.foundAd(campaignId, userId)

            if (foundAd) {
               const actions = await model.foundCampaignActions(campaignId, limit, offset)

               if (actions) {
                  return res.json({
                     status: 200,
                     message: "Success",
                     data: actions
                  })
               } else {
                  return res.json({
                     status: 400,
                     message: "Bad request"
                  })
               }
            } else {
               return res.json({
                  status: 404,
                  message: "User not found"
               })
            }

         } else {
            return res.json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   CAMPAIGN_ACTIONS_GRAPH: async (req, res) => {
      try {
         const { userId, campaignId, days } = req.query

         if (userId && campaignId && days) {
            const actionList = await model.actionListByCampaignId(userId, campaignId, days)

            if (actionList) {
               return res.json({
                  status: 200,
                  message: "Success",
                  data: actionList
               })
            } else {
               return res.json({
                  status: 404,
                  message: "Bad request"
               })
            }
         } else if (userId && days) {
            const actionList = await model.actionList(userId, days)

            if (actionList) {
               return res.json({
                  status: 200,
                  message: "Success",
                  data: actionList
               })
            } else {
               return res.json({
                  status: 404,
                  message: "Bad request"
               })
            }
         } else {
            return res.json({
               status: 400,
               message: "Bad request"
            })
         }

      } catch (error) {
         console.log(error)
         res.json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   }
}