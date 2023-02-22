import express from 'express'

const router = express.Router()

router.get("/", () => {
    res.json({ success: true, data: { age: 22, mobile: 8990909090 } })
})

router.get("/users", (req, res) => {
    // res.status(400).json({ success: false });
    res.status(200).json({ success: true, data: { name: "Pawel", age: 22 } })
});

export default router;