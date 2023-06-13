const model = require('./model');

module.exports = {
    GET: async (req, res) => {
        try {
            const { id, offset, userId } = req.query

            res.json({
                status: 200,
                message: "Success"
            })

        } catch (error) {
            console.log(error)
            res.json({
                status: 500,
                message: "Internal Server Error",
            })
        }
    },

    POST: async (req, res) => {
        try {
            const { app_ads_id, action, campaign_id, user_id } = req.body
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            // const app = await model.foundApp(app_ads_id)
            const ad = await model.foundAds(campaign_id)
            const findCampaign = await model.foundCampaign(campaign_id)
            const findApp = await model.foundAppResult(app_ads_id)
            let price = 0;
            const currentDate = new Date
            const currentHours = Number(currentDate.getHours())
            const currentMinutes = Number(currentDate.getMinutes())
            const currentDay = Number(currentDate.getDate())

            console.log(currentHours);

            if (action == 2 && ad.type_of_campaign.toLowerCase() === 'view') {
                price = price + ad.action_price
            } else if (action == 3 && ad.type_of_campaign.toLowerCase() === 'click') {
                price = price + ad.action_price
            } else if (action == 4 && ad.type_of_campaign.toLowerCase() === 'fullView') {
                price = price + ad.action_price
            }

            if (findCampaign) {
                const lastDate = findCampaign?.date.split(',')
                const lastHour = Number(lastDate[0])
                const lastMonth = Number(lastDate[1] - 1)
                const lastDay = Number(lastDate[2])

                if (currentDay == lastDay) {
                    const calculateTime = Number(currentMinutes - lastHour)

                    if (calculateTime >= 3) {
                        let time = `${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}`

                        const calculateCTR = Math.floor((findCampaign.clicks_count / findCampaign.views_count) * 100)
                        await model.updateCampaignCtr(campaign_id, calculateCTR)

                        const actionResultCampaign = await model.actionResultCampaign()

                        for (let i = 0; i < actionResultCampaign.length; i++) {
                            let view = {}
                            let click = {}
                            let fullView = {}

                            view['time'] = time
                            view['count'] = actionResultCampaign[i].views

                            click['time'] = time
                            click['count'] = actionResultCampaign[i].click

                            fullView['time'] = time
                            fullView['count'] = actionResultCampaign[i].full_views

                            await model.updateAdsCount(actionResultCampaign[i].campaign_id, view, click, fullView)
                        }

                        if (action == 2) {
                            await model.addCampaignResultView(time, campaign_id, price, user_id)
                        } else if (action == 3) {
                            await model.addCampaignResultClick(time, campaign_id, price, user_id)
                        } else if (action == 4) {
                            await model.addCampaignResultFullView(time, campaign_id, price, user_id)
                        }
                    } else {

                        if (action == 2) {
                            await model.updateCampaignResultView(campaign_id, price, user_id)
                        } else if (action == 3) {
                            await model.updateCampaignResultClick(campaign_id, price, user_id)
                        } else if (action == 4) {
                            await model.updateCampaignResultFullView(campaign_id, price, user_id)
                        }
                    }
                } else {
                    let hours = currentMinutes + 59
                    const calculateTime = hours - lastHour

                    if (calculateTime >= 3) {
                        let time = `${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}`

                        const calculateCTR = Math.floor((findCampaign.clicks_count / findCampaign.views_count) * 100)
                        await model.updateCampaignCtr(campaign_id, calculateCTR)

                        const actionResultCampaign = await model.actionResultCampaign()

                        for (let i = 0; i < actionResultCampaign.length; i++) {
                            let view = {}
                            let click = {}
                            let fullView = {}

                            view['time'] = time
                            view['count'] = actionResultCampaign[i].views

                            click['time'] = time
                            click['count'] = actionResultCampaign[i].click

                            fullView['time'] = time
                            fullView['count'] = actionResultCampaign[i].full_views

                            await model.updateAdsCount(actionResultCampaign[i].campaign_id, view, click, fullView)
                        }

                        if (action == 2) {
                            await model.addCampaignResultView(time, campaign_id, price, user_id)
                        } else if (action == 3) {
                            await model.addCampaignResultClick(time, campaign_id, price, user_id)
                        } else if (action == 4) {
                            await model.addCampaignResultFullView(time, campaign_id, price, user_id)
                        }

                    } else {
                        if (action == 2) {
                            await model.updateCampaignResultView(campaign_id, price, user_id)

                        } else if (action == 3) {
                            await model.updateCampaignResultClick(campaign_id, price, user_id)
                        } else if (action == 4) {
                            await model.updateCampaignResultFullView(campaign_id, price, user_id)
                        }
                    }
                }
            } else {
                const lastHour = Number(currentHours) + 3
                let time = `${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}`

                if (action == 2) {
                    await model.addCampaignResultView(time, campaign_id, price, user_id)
                } else if (action == 3) {
                    await model.addCampaignResultClick(time, campaign_id, price, user_id)
                } else if (action == 4) {
                    await model.addCampaignResultFullView(time, campaign_id, price, user_id)
                }
            }

            if (findApp) {
                const lastDate = findApp?.date.split(',')
                const lastHour = Number(lastDate[0])
                const lastMonth = Number(lastDate[1] - 1)
                const lastDay = Number(lastDate[2])

                if (currentDay == lastDay) {
                    const calculateTime = Number(currentMinutes - lastHour)

                    if (calculateTime >= 3) {
                        let time = `${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}`

                        if (action == 2) {
                            const addAppResultView = await model.addAppResultView(time, app_ads_id, price, user_id)

                            if (addAppResultView) {
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
                        } else if (action == 3) {
                            const addAppResultClick = await model.addAppResultClick(time, app_ads_id, price, user_id)

                            if (addAppResultClick) {
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
                        } else if (action == 4) {
                            const addAppResultFullView = await model.addAppResultFullView(time, app_ads_id, price, user_id)

                            if (addAppResultFullView) {
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
                        }

                    } else {
                        if (action == 2) {
                            const updateAppResultView = await model.updateAppResultView(app_ads_id, price, user_id)

                            if (updateAppResultView) {
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
                        } else if (action == 3) {
                            const updateAppResultClick = await model.updateAppResultClick(app_ads_id, price, user_id)

                            if (updateAppResultClick) {
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
                        } else if (action == 4) {
                            const updateAppResultFullView = await model.updateAppResultFullView(app_ads_id, price, user_id)

                            if (updateAppResultFullView) {
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
                        }
                    }
                } else {
                    let hours = currentMinutes + 59
                    const calculateTime = hours - lastHour
                    let time = `${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}`

                    if (calculateTime >= 3) {
                        if (action == 2) {
                            const addAppResultView = await model.addAppResultView(time, app_ads_id, price, user_id)

                            if (addAppResultView) {
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
                        } else if (action == 3) {
                            const addAppResultClick = await model.addAppResultClick(time, app_ads_id, price, user_id)

                            if (addAppResultClick) {
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
                        } else if (action == 4) {
                            const addAppResultFullView = await model.addAppResultFullView(time, app_ads_id, price, user_id)

                            if (addAppResultFullView) {
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
                        }
                    } else {
                        if (action == 2) {
                            const updateAppResultView = await model.updateAppResultView(app_ads_id, price, user_id)

                            if (updateAppResultView) {
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
                        } else if (action == 3) {
                            const updateAppResultClick = await model.updateAppResultClick(app_ads_id, price, user_id)

                            if (updateAppResultClick) {
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
                        } else if (action == 4) {
                            const updateAppResultFullView = await model.updateAppResultFullView(app_ads_id, price, user_id)

                            if (updateAppResultFullView) {
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
                        }
                    }
                }

            } else {
                const lastHour = Number(currentHours) + 3
                let time = `${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}`
                if (action == 2) {
                    const addAppResultView = await model.addAppResultView(time, app_ads_id, price, user_id)

                    if (addAppResultView) {
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
                } else if (action == 3) {
                    const addAppResultClick = await model.addAppResultClick(time, app_ads_id, price, user_id)

                    if (addAppResultClick) {
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
                } else if (action == 4) {
                    const addAppResultFullView = await model.addAppResultFullView(time, app_ads_id, price, user_id)

                    if (addAppResultFullView) {
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