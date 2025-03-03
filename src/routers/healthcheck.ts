import type { FastifyInstance } from "fastify"
import { register } from "prom-client"

const parsePrometheusMetrics = (metrics: string) => {
    const parsedMetrics: Record<string, any> = {}
    const lines = metrics.split("\n")
    let currentMetric = ""

    try {
        for (const line of lines) {
            if (line.startsWith("# HELP")) {
                const parts = line.split(" ")
                currentMetric = parts[2]
                parsedMetrics[currentMetric] = { help: parts.slice(3).join(" "), values: [] }
            } else if (line.startsWith("# TYPE")) {
                const parts = line.split(" ")
                parsedMetrics[parts[2]].type = parts[3]
            } else if (line && !line.startsWith("#")) {
                const match = line.match(/^([^{]+)(\{[^}]+\})?\s+(.+)$/)
                if (match) {
                    const [, name, labelsString, value] = match
                    const labels = labelsString
                        ? Object.fromEntries(
                            labelsString
                                .slice(1, -1)
                                .split(",")
                                .map((label) => label.split("=").map((part) => part.trim().replace(/^"|"$/g, ""))),
                        )
                        : {}
                    if (!parsedMetrics[name]) {
                        parsedMetrics[name] = { values: [] }
                    }
                    parsedMetrics[name].values.push({ labels, value: Number.parseFloat(value) })
                }
            }
        }
    } catch (error) {
        console.error("Error parsing metrics:", error)
    }

    return parsedMetrics
}

const healthcheck = (server: FastifyInstance) => {

    server.get("/", async (request, reply) => {
        try {
            const metrics = await register.metrics()
            const parsedMetrics = parsePrometheusMetrics(metrics)
   
            console.log(JSON.stringify(parsedMetrics))
            // return reply.view("healthcheck", {
            //     healthcheck: "healthcheck",
            //     metrics: JSON.stringify(parsedMetrics),
            // })
        } catch (error) {
            server.log.error(error)
            return reply.status(500).send("Error fetching metrics")
        }
    })
}

export default healthcheck