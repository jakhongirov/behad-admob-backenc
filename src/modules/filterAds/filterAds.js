const model = require('./model');

module.exports = {
    GET: async (req, res) => {
        try {
            const { type, deviceId, adId } = req.query
            const foundUser = await model.foundUser(deviceId)
            const app = await model.foundApp(adId)
            const findApp = await model.foundAppResult(adId)
            const currentDate = new Date
            const currentHours = Number(currentDate.getHours())
            const currentDay = Number(currentDate.getDate())
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            if (foundUser) {
                const foundAd = await model.foundAd(foundUser.user_age, foundUser.user_who, foundUser.user_country, foundUser.user_capital, foundUser.user_phone_lang, type,)

                if (foundAd) {
                    if (foundAd?.type_of_campaign.toLowerCase() === 'view') {
                        let result = 0

                        if (foundAd.view && foundAd.view.length > 0) {
                            for (let i = 0; i < foundAd.view.length; i++) {
                                result += foundAd.view[i].count;
                            }
                        }

                        if (result < foundAd.advertisement_limit) {

                            if (findApp) {
                                const lastDate = findApp?.date.split(',')
                                const lastHour = Number(lastDate[0])
                                const lastMonth = Number(lastDate[1] - 1)
                                const lastDay = Number(lastDate[2])

                                if (currentDay == lastDay) {
                                    const calculateTime = Number(currentHours - lastHour)

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                } else {
                                    let hours = currentHours + 23
                                    const calculateTime = hours - lastHour

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                }
                            } else {
                                const lastHour = Number(currentHours) + 3
                                let time = `
                                        ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                                `
                                await model.addAppResultRequest(time, adId, deviceId)
                            }

                            return res.json({
                                status: 200,
                                message: "Success",
                                data: {
                                    campaign_id: foundAd.campaign_id,
                                    advertisement_media_type: foundAd.advertisement_media_type,
                                    advertisement_link: foundAd.advertisement_link,
                                    advertisement_title: foundAd.advertisement_title,
                                    advertisement_description: foundAd.advertisement_description,
                                    advertisement_action_text: foundAd.advertisement_action_text
                                }
                            })
                        } else {
                            await model.updateStatusAd(foundAd.campaign_id)
                            return res.json({
                                status: 204,
                                message: "No Content"
                            })
                        }
                    } else if (foundAd?.type_of_campaign.toLowerCase() === 'click') {
                        let result = 0

                        if (foundAd.click && foundAd.click.length > 0) {
                            for (let i = 0; i < foundAd.click.length; i++) {
                                result += foundAd.click[i].count;
                            }
                        }

                        if (result < foundAd.advertisement_limit) {

                            if (findApp) {
                                const lastDate = findApp?.date.split(',')
                                const lastHour = Number(lastDate[0])
                                const lastMonth = Number(lastDate[1] - 1)
                                const lastDay = Number(lastDate[2])

                                if (currentDay == lastDay) {
                                    const calculateTime = Number(currentHours - lastHour)

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                } else {
                                    let hours = currentHours + 23
                                    const calculateTime = hours - lastHour

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                }
                            } else {
                                const lastHour = Number(currentHours) + 3
                                let time = `
                                        ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                                `
                                await model.addAppResultRequest(time, adId, deviceId)
                            }

                            return res.json({
                                status: 200,
                                message: "Success",
                                data: {
                                    campaign_id: foundAd.campaign_id,
                                    advertisement_media_type: foundAd.advertisement_media_type,
                                    advertisement_link: foundAd.advertisement_link,
                                    advertisement_title: foundAd.advertisement_title,
                                    advertisement_description: foundAd.advertisement_description,
                                    advertisement_action_text: foundAd.advertisement_action_text
                                }
                            })
                        } else {
                            await model.updateStatusAd(foundAd.campaign_id)
                            return res.json({
                                status: 204,
                                message: "No Content"
                            })
                        }
                    } else if (foundAd?.type_of_campaign.toLowerCase() === 'fullView') {
                        let result = 0

                        if (foundAd.full_view && foundAd.full_view.length > 0) {
                            for (let i = 0; i < foundAd.full_view.length; i++) {
                                result += foundAd.full_view[i].count;
                            }
                        }

                        if (result < foundAd.advertisement_limit) {

                            if (findApp) {
                                const lastDate = findApp?.date.split(',')
                                const lastHour = Number(lastDate[0])
                                const lastMonth = Number(lastDate[1] - 1)
                                const lastDay = Number(lastDate[2])

                                if (currentDay == lastDay) {
                                    const calculateTime = Number(currentHours - lastHour)

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                } else {
                                    let hours = currentHours + 23
                                    const calculateTime = hours - lastHour

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                }
                            } else {
                                const lastHour = Number(currentHours) + 3
                                let time = `
                                        ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                                `
                                await model.addAppResultRequest(time, adId, deviceId)
                            }

                            return res.json({
                                status: 200,
                                message: "Success",
                                data: {
                                    campaign_id: foundAd.campaign_id,
                                    advertisement_media_type: foundAd.advertisement_media_type,
                                    advertisement_link: foundAd.advertisement_link,
                                    advertisement_title: foundAd.advertisement_title,
                                    advertisement_description: foundAd.advertisement_description,
                                    advertisement_action_text: foundAd.advertisement_action_text
                                }
                            })
                        } else {
                            await model.updateStatusAd(foundAd.campaign_id)
                            return res.json({
                                status: 204,
                                message: "No Content"
                            })
                        }
                    }
                } else {
                    const chooseAllAd = await model.chooseAllAd(type)

                    if (chooseAllAd?.type_of_campaign.toLowerCase() === 'view') {
                        let result = 0

                        if (chooseAllAd.view && chooseAllAd.view.length > 0) {
                            for (let i = 0; i < chooseAllAd.view.length; i++) {
                                result += chooseAllAd.view[i].count;
                            }
                        }

                        if (result < chooseAllAd.advertisement_limit) {
                            if (findApp) {
                                const lastDate = findApp?.date.split(',')
                                const lastHour = Number(lastDate[0])
                                const lastMonth = Number(lastDate[1] - 1)
                                const lastDay = Number(lastDate[2])

                                if (currentDay == lastDay) {
                                    const calculateTime = Number(currentHours - lastHour)

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                } else {
                                    let hours = currentHours + 23
                                    const calculateTime = hours - lastHour

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                }
                            } else {
                                const lastHour = Number(currentHours) + 3
                                let time = `
                                        ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                                `
                                await model.addAppResultRequest(time, adId, deviceId)
                            }
                            return res.json({
                                status: 200,
                                message: "Success",
                                data: {
                                    campaign_id: chooseAllAd.campaign_id,
                                    advertisement_media_type: chooseAllAd.advertisement_media_type,
                                    advertisement_link: chooseAllAd.advertisement_link,
                                    advertisement_title: chooseAllAd.advertisement_title,
                                    advertisement_description: chooseAllAd.advertisement_description,
                                    advertisement_action_text: chooseAllAd.advertisement_action_text
                                }
                            })
                        } else {
                            await model.updateStatusAd(chooseAllAd.campaign_id)
                            return res.json({
                                status: 204,
                                message: "No Content"
                            })
                        }
                    } else if (chooseAllAd?.type_of_campaign.toLowerCase() === 'click') {
                        let result = 0

                        if (chooseAllAd.click && chooseAllAd.click.length > 0) {
                            for (let i = 0; i < chooseAllAd.click.length; i++) {
                                result += chooseAllAd.click[i].count;
                            }
                        }

                        if (result < chooseAllAd.advertisement_limit) {
                            if (findApp) {
                                const lastDate = findApp?.date.split(',')
                                const lastHour = Number(lastDate[0])
                                const lastMonth = Number(lastDate[1] - 1)
                                const lastDay = Number(lastDate[2])

                                if (currentDay == lastDay) {
                                    const calculateTime = Number(currentHours - lastHour)

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                } else {
                                    let hours = currentHours + 23
                                    const calculateTime = hours - lastHour

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                }
                            } else {
                                const lastHour = Number(currentHours) + 3
                                let time = `
                                        ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                                `
                                await model.addAppResultRequest(time, adId, deviceId)
                            }
                            return res.json({
                                status: 200,
                                message: "Success",
                                data: {
                                    campaign_id: chooseAllAd.campaign_id,
                                    advertisement_media_type: chooseAllAd.advertisement_media_type,
                                    advertisement_link: chooseAllAd.advertisement_link,
                                    advertisement_title: chooseAllAd.advertisement_title,
                                    advertisement_description: chooseAllAd.advertisement_description,
                                    advertisement_action_text: chooseAllAd.advertisement_action_text
                                }
                            })
                        } else {
                            await model.updateStatusAd(chooseAllAd.campaign_id)
                            return res.json({
                                status: 204,
                                message: "No Content"
                            })
                        }
                    } else if (chooseAllAd?.type_of_campaign.toLowerCase() === 'fullView') {
                        let result = 0

                        if (chooseAllAd.full_view && chooseAllAd.full_view.length > 0) {
                            for (let i = 0; i < chooseAllAd.full_view.length; i++) {
                                result += chooseAllAd.full_view[i].count;
                            }
                        }

                        if (result < chooseAllAd.advertisement_limit) {
                            if (findApp) {
                                const lastDate = findApp?.date.split(',')
                                const lastHour = Number(lastDate[0])
                                const lastMonth = Number(lastDate[1] - 1)
                                const lastDay = Number(lastDate[2])

                                if (currentDay == lastDay) {
                                    const calculateTime = Number(currentHours - lastHour)

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                } else {
                                    let hours = currentHours + 23
                                    const calculateTime = hours - lastHour

                                    if (calculateTime >= 3) {
                                        let time = `
                                            ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                        `
                                        await model.addAppResultRequest(time, adId, deviceId)
                                    } else {
                                        await model.updateAppResultRequest(adId, deviceId)
                                    }
                                }
                            } else {
                                const lastHour = Number(currentHours) + 3
                                let time = `
                                        ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                                `
                                await model.addAppResultRequest(time, adId, deviceId)
                            }
                            return res.json({
                                status: 200,
                                message: "Success",
                                data: {
                                    campaign_id: chooseAllAd.campaign_id,
                                    advertisement_media_type: chooseAllAd.advertisement_media_type,
                                    advertisement_link: chooseAllAd.advertisement_link,
                                    advertisement_title: chooseAllAd.advertisement_title,
                                    advertisement_description: chooseAllAd.advertisement_description,
                                    advertisement_action_text: chooseAllAd.advertisement_action_text
                                }
                            })
                        } else {
                            await model.updateStatusAd(chooseAllAd.campaign_id)
                            return res.json({
                                status: 204,
                                message: "No Content"
                            })
                        }
                    }
                }
            } else {
                const chooseAllAd = await model.chooseAllAd(type)

                if (chooseAllAd?.type_of_campaign.toLowerCase() === 'view') {
                    let result = 0

                    if (chooseAllAd.view && chooseAllAd.view.length > 0) {
                        for (let i = 0; i < chooseAllAd.view.length; i++) {
                            result += chooseAllAd.view[i].count;
                        }
                    }

                    if (result < chooseAllAd.advertisement_limit) {
                        if (findApp) {
                            const lastDate = findApp?.date.split(',')
                            const lastHour = Number(lastDate[0])
                            const lastMonth = Number(lastDate[1] - 1)
                            const lastDay = Number(lastDate[2])

                            if (currentDay == lastDay) {
                                const calculateTime = Number(currentHours - lastHour)

                                if (calculateTime >= 3) {
                                    let time = `
                                        ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                    `
                                    await model.addAppResultRequest(time, adId, deviceId)
                                } else {
                                    await model.updateAppResultRequest(adId, deviceId)
                                }
                            } else {
                                let hours = currentHours + 23
                                const calculateTime = hours - lastHour

                                if (calculateTime >= 3) {
                                    let time = `
                                        ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                    `
                                    await model.addAppResultRequest(time, adId, deviceId)
                                } else {
                                    await model.updateAppResultRequest(adId, deviceId)
                                }
                            }
                        } else {
                            const lastHour = Number(currentHours) + 3
                            let time = `
                                    ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                            `
                            await model.addAppResultRequest(time, adId, deviceId)
                        }
                        return res.json({
                            status: 200,
                            message: "Success",
                            data: {
                                campaign_id: chooseAllAd.campaign_id,
                                advertisement_media_type: chooseAllAd.advertisement_media_type,
                                advertisement_link: chooseAllAd.advertisement_link,
                                advertisement_title: chooseAllAd.advertisement_title,
                                advertisement_description: chooseAllAd.advertisement_description,
                                advertisement_action_text: chooseAllAd.advertisement_action_text
                            }
                        })
                    } else {
                        await model.updateStatusAd(chooseAllAd.campaign_id)
                        return res.json({
                            status: 204,
                            message: "No Content"
                        })
                    }
                } else if (chooseAllAd?.type_of_campaign.toLowerCase() === 'click') {
                    let result = 0

                    if (chooseAllAd.click && chooseAllAd.click.length > 0) {
                        for (let i = 0; i < chooseAllAd.click.length; i++) {
                            result += chooseAllAd.click[i].count;
                        }
                    }

                    if (result < chooseAllAd.advertisement_limit) {
                        if (findApp) {
                            const lastDate = findApp?.date.split(',')
                            const lastHour = Number(lastDate[0])
                            const lastMonth = Number(lastDate[1] - 1)
                            const lastDay = Number(lastDate[2])

                            if (currentDay == lastDay) {
                                const calculateTime = Number(currentHours - lastHour)

                                if (calculateTime >= 3) {
                                    let time = `
                                        ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                    `
                                    await model.addAppResultRequest(time, adId, deviceId)
                                } else {
                                    await model.updateAppResultRequest(adId, deviceId)
                                }
                            } else {
                                let hours = currentHours + 23
                                const calculateTime = hours - lastHour

                                if (calculateTime >= 3) {
                                    let time = `
                                        ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                    `
                                    await model.addAppResultRequest(time, adId, deviceId)
                                } else {
                                    await model.updateAppResultRequest(adId, deviceId)
                                }
                            }
                        } else {
                            const lastHour = Number(currentHours) + 3
                            let time = `
                                    ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                            `
                            await model.addAppResultRequest(time, adId, deviceId)
                        }
                        return res.json({
                            status: 200,
                            message: "Success",
                            data: {
                                campaign_id: chooseAllAd.campaign_id,
                                advertisement_media_type: chooseAllAd.advertisement_media_type,
                                advertisement_link: chooseAllAd.advertisement_link,
                                advertisement_title: chooseAllAd.advertisement_title,
                                advertisement_description: chooseAllAd.advertisement_description,
                                advertisement_action_text: chooseAllAd.advertisement_action_text
                            }
                        })
                    } else {
                        await model.updateStatusAd(chooseAllAd.campaign_id)
                        return res.json({
                            status: 204,
                            message: "No Content"
                        })
                    }
                } else if (chooseAllAd?.type_of_campaign.toLowerCase() === 'fullView') {
                    let result = 0

                    if (chooseAllAd.full_view && chooseAllAd.full_view.length > 0) {
                        for (let i = 0; i < chooseAllAd.full_view.length; i++) {
                            result += chooseAllAd.full_view[i].count;
                        }
                    }

                    if (result < chooseAllAd.advertisement_limit) {

                        if (findApp) {
                            const lastDate = findApp?.date.split(',')
                            const lastHour = Number(lastDate[0])
                            const lastMonth = Number(lastDate[1] - 1)
                            const lastDay = Number(lastDate[2])

                            if (currentDay == lastDay) {
                                const calculateTime = Number(currentHours - lastHour)

                                if (calculateTime >= 3) {
                                    let time = `
                                        ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                    `
                                    await model.addAppResultRequest(time, adId, deviceId)
                                } else {
                                    await model.updateAppResultRequest(adId, deviceId)
                                }
                            } else {
                                let hours = currentHours + 23
                                const calculateTime = hours - lastHour

                                if (calculateTime >= 3) {
                                    let time = `
                                        ${lastDay} ${month[lastMonth]} ${lastHour}:${currentDate.getMinutes()} - ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()}
                                    `
                                    await model.addAppResultRequest(time, adId, deviceId)
                                } else {
                                    await model.updateAppResultRequest(adId, deviceId)
                                }
                            }
                        } else {
                            const lastHour = Number(currentHours) + 3
                            let time = `
                                    ${currentDay} ${month[currentDate.getMonth()]} ${currentHours}:${currentDate.getMinutes()} - ${lastHour > 24 ? currentDay + 1 : currentDay} ${month[currentDate.getMonth()]} ${lastHour > 24 ? lastHour : lastHour - 24}:${currentDate.getMinutes()}
                            `
                            await model.addAppResultRequest(time, adId, deviceId)
                        }

                        return res.json({
                            status: 200,
                            message: "Success",
                            data: {
                                campaign_id: chooseAllAd.campaign_id,
                                advertisement_media_type: chooseAllAd.advertisement_media_type,
                                advertisement_link: chooseAllAd.advertisement_link,
                                advertisement_title: chooseAllAd.advertisement_title,
                                advertisement_description: chooseAllAd.advertisement_description,
                                advertisement_action_text: chooseAllAd.advertisement_action_text
                            }
                        })
                    } else {
                        await model.updateStatusAd(chooseAllAd.campaign_id)
                        return res.json({
                            status: 204,
                            message: "No Content"
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
    }
}