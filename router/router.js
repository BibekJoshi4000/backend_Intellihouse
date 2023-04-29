const express = require("express");
const mongoose = require('mongoose')
const Model = require('../model/dbModel')
const router = express.Router()
const axios = require('axios');

router.post('/add', async function (req, res) {
    const { relay1, relay2, relay3, relay4, humidity, temperature } = req.body

    try {
        const data = await Model.create({ relay1, relay2, relay3, relay4, humidity, temperature })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }

})


router.put('/updateSensor', async function (req, res) {
    const id = "64492803b65e48b1237504f0";
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Id found' })
    }
    try {
        const data = await Model.findOneAndUpdate({ _id: id }, {
            ...req.body
        })
        if (!data) {
            return res.status(400).json({ error: 'No such Sensor' })
        }

        res.status(200).json({ "temperature": data.temperature, "humidity": data.humidity })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }

})



router.put('/updateRelay', async function (req, res) {
    const id = "64492803b65e48b1237504f0";
    const { relay1, relay2, relay3, relay4 } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Id found' })
    }
    try {
        updateData = {
            "relay1": relay1,
            "relay2": relay2,
            "relay3": relay3,
            "relay4": relay4
        }
        const data = await Model.findOneAndUpdate({ _id: id }, {
            ...updateData
        })
        if (!data) {
            return res.status(400).json({ error: 'No such Sensor' })
        }

        res.status(200).json(updateData)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }

})




router.get("/relayData", async function (req, res) {
    const id = "64492803b65e48b1237504f0";
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Id found' })
    }
    try {
        const data = await Model.findById({ _id: id })
        if (!data) {
            return res.status(400).json({ error: 'No such Sensor' })
        }
        var today = new Date()
        if (today.getHours() >= 10) {
            data.relay1 = "off"
            data.relay2 = "off"
            updateData = {
                "relay1": data.relay1,
                "relay2": data.relay2,
                "relay3": data.relay3,
                "relay4": data.relay4
            }
            
            axios.put("https://intellihouse.cyclic.app/api/v1/updateRelay",updateData).then((response)=>{
                console.log(`Status: ${response.status}`);
                console.log('Body: ', response.data);
                return res.status(200).json({
                                            "relay1": data.relay1,
                                            "relay2": data.relay2,
                                            "relay3": data.relay3,
                                            "relay4": data.relay4,
                                        })

            }).catch((err) => {
                console.error(err);
            });


            

        }
       else
       {
        return res.status(200).json({
            "relay1": data.relay1,
            "relay2": data.relay2,
            "relay3": data.relay3,
            "relay4": data.relay4,
        })
    }

    }
    catch (error) {
         return res.status(400).json({ error: error.message })
    }

})




router.get("/sensorData", async function (req, res) {
    const id = "64492803b65e48b1237504f0";
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such Id found' })
    }
    try {
        const data = await Model.findById({ _id: id })
        if (!data) {
            return res.status(400).json({ error: 'No such Sensor' })
        }
        res.status(200).json({
            "humidity": data.humidity,
            "temperature": data.temperature

        })

    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }

})


module.exports = router;
