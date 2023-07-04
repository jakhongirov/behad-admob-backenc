const express = require("express")
const router = express.Router()
const { AUTH } = require('../middleware/auth')
const FileUpload = require('../middleware/multer')

const login = require('./login/login')
const users = require('./users/users')
const categories = require('./categories/categories')
const apps = require('./apps/apps')
const advertisement = require('./advertisements/advertisements')
const action = require('./action/action')
const filterAd = require('./filterAds/filterAds')
const gplay = require('./gplay/gplay')
const actionCampaign = require('./actionCampaign/actionCampaign')

router
    .post('/login', login.LOGIN)
    .post('/register', login.REGISTER)

    .get('/users', users.GET)
    .put('/editUser', users.PUT)
    .delete('/deleteUser', users.DELETE)

    .get('/categories', categories.GET)
    .post('/addCategory', categories.POST)
    .put('/editCategory', categories.PUT)
    .delete('/deleteCategory', categories.DELETE)

    .get('/apps', apps.GET_APP_SIDE)
    .get('/appsList', apps.GET_LIST)
    .get('/appResult', apps.GET_RESULT)
    .post('/addApp', FileUpload.single('photo'), apps.POST)
    .put('/editApp', FileUpload.single('photo'), apps.PUT)
    .put('/editAppStatus', apps.PUT_STATUS)
    .delete('/deleteApp', apps.DELETE_APP)

    .get('/advertisements', advertisement.GET)
    .post('/addAdvertisement', FileUpload.single('photo'), advertisement.POST)
    .put('./editAdvertisement', FileUpload.single('photo'), advertisement.PUT)
    .put('/editAdStatus', advertisement.PUT_STATUS)
    .delete('/deleteAdvertisement', advertisement.DELETE)

    .get('/action', action.GET)
    .get('/start', action.USE_SCHEDULE)
    .post('/addAction', action.POST)

    .get('/actionCampaign', actionCampaign.CALCULATE_ACTION_CAMPAIGN)

    .get('/filterAd', filterAd.GET)
    
    .get('/gplay', gplay.GET_GOOGLE_PLAY_APP);

module.exports = router   
