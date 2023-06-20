const model = require('./model');
const schedule = require('node-schedule');
let check = true

module.exports = {
    GET: async (req, res) => {
        try {
            const { id, offset, userId } = req.query
            if (id) {
                const actionResultById = await model.actionResultById(id, offset)

                if (actionResultById) {
                    return res.json({
                        status: 200,
                        message: "Success",
                        data: actionResultById
                    })
                } else {
                    return res.json({
                        status: 404,
                        message: "Not found"
                    })
                }
            } else if (offset) {
                const actionResultByOffset = await model.actionResultByOffset(offset)

                if (actionResultByOffset) {
                    return res.json({
                        status: 200,
                        message: "Success",
                        data: actionResultByOffset
                    })
                } else {
                    return res.json({
                        status: 404,
                        message: "Not found"
                    })
                }
            } else {
                const actionResult = await model.actionResult()

                if (actionResult) {
                    return res.json({
                        status: 200,
                        message: "Success",
                        data: actionResult
                    })
                } else {
                    return res.json({
                        status: 404,
                        message: "Not found"
                    })
                }
            }

        } catch (error) {
            console.log(error)
            res.json({
                status: 500,
                message: "Internal Server Error",
            })
        }
    },

    USE_SCHEDULE: async (_, res) => {

        schedule.scheduleJob('0 */3 * * *', async () => {
            try {
                if (check) {
                    check = false
                    const actionTemp = await model.actionTemp()
                    const actionTempCampaign = await model.actionTempCampaign()
                    const actionTempUsers = await model.actionTempUsers()
                    const actionTempCampaignUsers = await model.actionTempCampaignUsers()
                    const currDate = new Date();
                    const currHours = currDate.getHours() + 5
                    const currMinutes = currDate.getMinutes()
                    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const monthName = month[currDate.getMonth()]
                    const year = currDate.getFullYear()
                    const day = currDate.getDate()
                    const lastHour = Number(currHours) - 3

                    const time = `${lastHour > 0 ? day : day - 1} ${monthName} ${year}  ${lastHour > 0 ? lastHour : lastHour + 24}:${currMinutes} - ${day} ${monthName} ${year} ${currHours == 24 ? 0 : currHours > 24 ? currHours - 24: currHours }:${currMinutes}`

                    for (let i = 0; i < actionTemp.length; i++) {

                        if (actionTemp[i].actions == 1) {
                            const added = await model.addActionResultRequest(time, actionTemp[i].app_ads_id, actionTemp[i].count)

                            if (added) {
                                const actionTempPrice = await model.actionTempPriceCount(actionTemp[i].app_ads_id)

                                for (let i = 0; i < actionTempPrice.length; i++) {
                                    await model.addCount(actionTempPrice[i].app_ads_id, actionTempPrice[i].sum)
                                }
                            }

                        } else if (actionTemp[i].actions == 2) {
                            await model.addActionResultView(actionTemp[i].app_ads_id, actionTemp[i].count)
                        } else if (actionTemp[i].actions == 3) {
                            await model.addActionResultClick(actionTemp[i].app_ads_id, actionTemp[i].count)
                        } else if (actionTemp[i].actions == 4) {
                            await model.addActionResultFullViews(actionTemp[i].app_ads_id, actionTemp[i].count)
                        }

                    }

                    for (let i = 0; i < actionTempCampaign.length; i++) {
                        if (actionTempCampaign[i].actions == 2) {
                            const added = await model.addActionResultCampaignView(time, actionTempCampaign[i].campaign_id, actionTempCampaign[i].count)

                            if (added) {
                                const actionTempCampaignPrice = await model.actionTempCampaignPrice(actionTempCampaign[i].campaign_id)
                                await model.addActionResultCampaignCount(actionTempCampaignPrice?.campaign_id, actionTempCampaignPrice?.sum)

                            }
                            let view = {}
                            view['time'] = time
                            view['count'] = actionTempCampaign[i].count
                            await model.updateAdsViewCount(actionTempCampaign[i].campaign_id, view)

                        } else if (actionTempCampaign[i].actions == 3) {
                            await model.addActionResultCampaignClick(actionTempCampaign[i].campaign_id, actionTempCampaign[i].count)
                            let click = {}
                            click['time'] = time
                            click['count'] = actionTempCampaign[i].count
                            await model.updateAdsClickCount(actionTempCampaign[i].campaign_id, click)

                        } else if (actionTemp[i].actions == 4) {
                            await model.addActionResultCampaignFullView(actionTempCampaign[i].campaign_id, actionTempCampaign[i].count)
                            let fullView = {}
                            fullView['time'] = time
                            fullView['count'] = actionTempCampaign[i].count
                            await model.updateAdsFullViewCount(actionTempCampaign[i].campaign_id, fullView)
                        }
                    }

                    for (let i = 0; i < actionTempUsers.length; i++) {
                        await model.addActionAppAdsUserId(actionTempUsers[i].app_ads_id, actionTempUsers[i].user_id)
                    }
                    for (let i = 0; i < actionTempCampaignUsers.length; i++) {
                        await model.addActionsCampaignUserId(actionTempCampaignUsers[i].campaign_id, actionTempCampaignUsers[i].user_id)
                    }

                    const actionResultCampaignIds = await model.actionResultCampaignIds()
                    
                    for (let i = 0; i < actionResultCampaignIds?.length; i++) {
                        const actionResultCampaignCtr = await model.actionResultCampaignCtr(actionResultCampaignIds[i].campaign_id)
                        const calcularedCTR = Math.floor((actionResultCampaignCtr?.click / actionResultCampaignCtr?.views) * 100)
                        let ctr = {}

                        ctr['time'] = time
                        ctr['precent'] = calcularedCTR

                        await model.updateAdCTR(actionResultCampaignCtr[i].campaign_id, ctr)
                    }
                } else {
                    return ""
                }
            } catch (error) {
                console.log(error)
                res.json({
                    status: 500,
                    message: "Internal Server Error",
                })
            } finally {
                await model.clearActionTemp()
                check = true
            }
        });

        res.json({
            status: 200,
            message: "START"
        })
    },

    POST: async (req, res) => {
        try {
            const { app_ads_id, action, campaign_id, user_id } = req.body
            const app = await model.foundApp(app_ads_id)
            const ad = await model.foundAds(campaign_id)
            let price = 0;

            if (action == 2 && ad.type_of_campaign.toLowerCase() === 'view') {
                price = price + ad.action_price
            } else if (action == 3 && ad.type_of_campaign.toLowerCase() === 'click') {
                price = price + ad.action_price
            } else if (action == 4 && ad.type_of_campaign.toLowerCase() === 'fullView') {
                price = price + ad.action_price
            }

            const addActionTemp = await model.addActionTemp(app.app_id, app_ads_id, action, campaign_id, user_id, price)

            if (addActionTemp) {
                return res.json({
                    status: 200,
                    message: "Success"
                })
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

    // CALCULATE_ACTIONS: async () => {
    //     try {

    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             status: 500,
    //             message: "Internal Server Error",
    //         })  
    //     }
    // }
}