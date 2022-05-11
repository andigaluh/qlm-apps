import React from "react";
import {
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  content__item__header: {
    fontSize: "12",
    marginBottom: "10",
  },
});

function PdfHeaderSection({ titleSection }) {
    return (
      <View style={styles.content__item__header}>
        <Text>{titleSection}</Text>
      </View>
    );
};

export default PdfHeaderSection;