import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatdate } from "../helpers/DateCustom";
import PdfHeaderSection from "./PdfHeaderSection";
import PdfContentAdditionalCheck from "./PdfContentAdditionalCheck";
import PdfContentDetailNg from "./PdfContentDetailNg";
import PdfContentItemCheck from "./PdfContentItemCheck";



const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
  },

  content: {
    display: "flex",
    flexDirection: "column",
  },

  content__info: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  info__item: {
    marginBottom: "20",
  },
  item__label: {
    fontSize: "9",
    fontWeight: "normal",
    marginBottom: "5",
    marginRight: "20",
  },
  item__value: {
    fontSize: "10",
    fontWeight: "normal",
    borderBottom: "1px solid grey",
    width: "160",
    marginRight: "20",
  },
  content__item: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20",
  },
  
});

function PdfGenerateFile({ machine }) {  

  let itemCheck = machine.status_parts;
  let detailNg = machine.problems;
  let additionalCheck = machine.need_parts;
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.content__info}>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Type</Text>
                <Text style={styles.item__value}>{machine.wm_type_name}</Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Inspector</Text>
                <Text style={styles.item__value}>
                  {machine.inspection_name}
                </Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Model</Text>
                <Text style={styles.item__value}>{machine.wm_model_name}</Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Lot qty</Text>
                <Text style={styles.item__value}>
                  {machine.inspection_lot_qty}
                </Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Qty</Text>
                <Text style={styles.item__value}>{machine.inspection_qty}</Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Group</Text>
                <Text style={styles.item__value}>
                  {machine.inspection_group}
                </Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Line</Text>
                <Text style={styles.item__value}>
                  {machine.inspection_line}
                </Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Lot ke</Text>
                <Text style={styles.item__value}>
                  {machine.inspection_lot_ke}
                </Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Serial Number</Text>
                <Text style={styles.item__value}>{machine.inspection_sn}</Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Inspection Date</Text>
                <Text style={styles.item__value}>
                  {formatdate(machine.inspection_date)}
                </Text>
              </View>
              <View style={styles.info__item}>
                <Text style={styles.item__label}>Status</Text>
                <Text style={styles.item__value}>
                  {machine.inspection_status}
                </Text>
              </View>
            </View>
            {itemCheck && (
              <View style={styles.content__item}>
                <PdfHeaderSection titleSection="Items Check" />
                <PdfContentItemCheck content={itemCheck} />
              </View>
            )}
            {detailNg.length > 0 && (
              <View style={styles.content__item}>
                <PdfHeaderSection titleSection="Detail NG" />
                <PdfContentDetailNg content={detailNg} />
              </View>
            )}

            {additionalCheck.length > 0 && (
              <View style={styles.content__item}>
                <PdfHeaderSection titleSection="Additional Check" />
                <PdfContentAdditionalCheck content={additionalCheck} />
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default PdfGenerateFile;
