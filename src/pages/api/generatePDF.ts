import type { NextApiRequest, NextApiResponse } from "next"
import { renderToStream } from "@react-pdf/renderer"
// Importación directa del HelloWorldTemplate
import { HelloWorldTemplate } from "../../pdf/templates"
import { createElement } from "react"

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Solo obtenemos data de los query parameters
    const { data } = req.query

    // Parse the data if provided
    let templateData = {}
    if (data) {
      try {
        templateData = typeof data === "string" ? JSON.parse(data) : data
      } catch (error) {
        return res.status(400).json({ error: "Invalid data format" })
      }
    }

    // Create the PDF document usando directamente HelloWorldTemplate
    const MyDocument = createElement(HelloWorldTemplate, templateData);

    // Set response headers for PDF
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="hello-world.pdf"`)

    // Create a readable stream from the PDF
    const stream = await renderToStream(MyDocument)

    // Pipe the stream to the response
    stream.pipe(res)

    // Handle stream errors
    stream.on("error", (error) => {
      console.error("Error streaming PDF:", error)
      res.status(500).json({ error: "Error generating PDF" })
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    res.status(500).json({ error: "Error generating PDF" })
  }
}