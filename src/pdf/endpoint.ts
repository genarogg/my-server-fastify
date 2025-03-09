import { renderToStream } from "@react-pdf/renderer";
import * as templates from "./templates";
import { createElement } from "react";

const schema = `
  input DataInput {
    message: String
    items: [String]
  }

  type Query {
    generatePDF(template: String!, data: DataInput!): String
  }
`;

const resolvers = {
  Query: {
    generatePDF: async (_: any, { template, data }: { template: string; data: { message: string; items: string[] } }) => {
      try {
        const componentName = template
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("") + "Template";

        const Template = templates[componentName as keyof typeof templates];

        if (!Template) {
          throw new Error("Template not found");
        }

        // Asegurar que el tipo sea correcto
        const MyDocument: any = createElement(Template, { data });

        // Renderizar a stream el documento correctamente tipado
        const stream = await renderToStream(MyDocument);

        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
          stream.on("error", (error) => reject(error));
        });
      } catch (error) {
        throw new Error("Error generating PDF: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    },
  },
};

export { schema, resolvers };