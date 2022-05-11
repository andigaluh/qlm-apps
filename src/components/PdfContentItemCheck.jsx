import React from "react";
import {
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    content: {
        display: "flex",
        flexDirection: "column",
    },
    content__th: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: "5",
        paddingBottom: "5",
        paddingTop: "5",
        border: "1px solid grey",
    },
    content__tr: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: "10",
        paddingLeft: "5",
        paddingBottom: "5",
        paddingTop: "5",
        borderBottom: "1px solid grey",
    },
    content__col150: {
        width: "150",
        marginRight: "10",
    },
    content__col40: {
        width: "40",
        marginRight: "10",
    },
    content__col15: {
        width: "15",
        marginRight: "10",
    },
    content__col100: {
        width: "100",
        marginRight: "10",
    },
    content__text: {
        fontSize: "9",
        fontWeight: "normal",
    },
    content__text__header: {
        fontSize: "9",
        fontWeight: "bold",
    },
    
});

function PdfContentItemCheck({ content }) {
    return (
        <View style={styles.content}>
            <View style={styles.content__th}>
                <View style={styles.content__col15}>
                    <Text style={styles.content__text__header}>No</Text>
                </View>
                <View style={styles.content__col150}>
                    <Text style={styles.content__text__header}>Item</Text>
                </View>
                <View style={styles.content__col150}>
                    <Text style={styles.content__text__header}>Standard</Text>
                </View>
                <View style={styles.content__col40}>
                    <Text style={styles.content__text__header}>Status</Text>
                </View>
                <View style={styles.content__col100}>
                    <Text style={styles.content__text__header}>Result</Text>
                </View>
            </View>
            {content.map((value, index) => (
                <View style={styles.content__th}>
                    <View style={styles.content__col15}>
                        <Text style={styles.content__text__header}>{index + 1}</Text>
                    </View>
                    <View style={styles.content__col150}>
                        <Text style={styles.content__text}>{value.wm_item_check_name}</Text>
                    </View>
                    <View style={styles.content__col150}>
                        <Text style={styles.content__text}>{value.wm_item_check_standard}</Text>
                    </View>
                    <View style={styles.content__col40}>
                        <Text style={styles.content__text__header}>{value.status}</Text>
                    </View>
                    <View style={styles.content__col100}>
                        <Text style={styles.content__text}>{value.wm_item_check_result}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default PdfContentItemCheck;