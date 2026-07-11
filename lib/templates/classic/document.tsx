import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { DocumentProps } from "@/lib/templates/types";
import { CLASSIC } from "./layout";

/**
 * The printable A4 Classic cover. Uses the built-in Times family (Times-Roman /
 * Times-Bold) so generation is instant and needs no network font fetch. The
 * proportions come from the shared `CLASSIC` layout constants, so this stays
 * pixel-faithful to `preview.tsx`.
 */

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: CLASSIC.pagePadding,
    color: "#000000",
  },
  frame: {
    flexGrow: 1,
    borderWidth: CLASSIC.frame.border,
    borderColor: "#000000",
    paddingHorizontal: CLASSIC.frame.paddingX,
    paddingTop: CLASSIC.frame.paddingTop,
    paddingBottom: CLASSIC.frame.paddingBottom,
    alignItems: "center",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: CLASSIC.title.size,
    textAlign: "center",
  },
  subject: {
    fontFamily: "Times-Bold",
    fontSize: CLASSIC.subject.size,
    textAlign: "center",
  },
  submittedWrap: {
    width: "100%",
    alignItems: "flex-end",
  },
  submittedBlock: {
    marginRight: CLASSIC.submitted.blockMarginRight,
  },
  submittedLabel: {
    fontFamily: "Times-Roman",
    fontSize: CLASSIC.submitted.labelSize,
    marginBottom: CLASSIC.submitted.gapBelowLabel,
  },
  submittedDetails: {
    marginLeft: CLASSIC.submitted.indent,
  },
  detailValue: {
    fontFamily: "Times-Bold",
    fontSize: CLASSIC.submitted.valueSize,
    marginBottom: CLASSIC.submitted.rowGap,
  },
});

export function ClassicDocument({ data }: DocumentProps) {
  return (
    <Document
      title={`${data.assignmentNumber} — ${data.subject}`}
      author={data.studentName}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.frame}>
          <View style={{ flexGrow: CLASSIC.flex.top }} />

          <Text style={styles.title}>{data.assignmentNumber}</Text>

          <View style={{ height: CLASSIC.title.gapBelow }} />

          <Text style={styles.subject}>{data.subject}</Text>

          <View style={{ flexGrow: CLASSIC.flex.middle }} />

          <View style={styles.submittedWrap}>
            <View style={styles.submittedBlock}>
              <Text style={styles.submittedLabel}>Submitted by</Text>
              <View style={styles.submittedDetails}>
                <Text style={styles.detailValue}>{data.studentName}</Text>
                <Text style={styles.detailValue}>{data.rollNumber}</Text>
                <Text style={styles.detailValue}>{data.department}</Text>
                <Text style={[styles.detailValue, { marginBottom: 0 }]}>
                  {data.semester}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flexGrow: CLASSIC.flex.bottom }} />
        </View>
      </Page>
    </Document>
  );
}
