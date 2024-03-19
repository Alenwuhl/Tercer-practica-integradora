import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    req.logger.fatal("Log de prueba de fatal")
    req.logger.error("Log de prueba de error")
    req.logger.warning("Log de prueba de warning")
    req.logger.info("Log de prueba de info")
    req.logger.http("Log de prueba de http")
    req.logger.debug("Log de prueba de debug")
    res.status(200).send("Loggers enviados")
})

export default router
