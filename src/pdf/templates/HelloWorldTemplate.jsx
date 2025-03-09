import React from "react";
import { Document, Page, Text } from "@react-pdf/renderer";

const HelloWorldTemplate = ({ data }) => (
  <Document>
    <Page>
      <Text>{data.message}</Text>
    </Page>
  </Document>
);

export default HelloWorldTemplate;