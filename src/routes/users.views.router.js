import { Router } from 'express';

const router = Router();

router.get("/register", (req, res) => {
    res.render('register', {
        title: "Register",
        fileCss: "styles.css",
    })
})

export default router;