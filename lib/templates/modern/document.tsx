import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { DocumentProps } from "@/lib/templates/types";
import { MODERN } from "./layout";

/**
 * The printable A4 "With teacher" cover — the Classic serif/bordered layout
 * plus a "Submitted to" (teacher) block on the left. Uses the built-in Times
 * family so generation is instant and offline, and mirrors `preview.tsx`.
 */

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: MODERN.pagePadding,
    color: "#000000",
  },
  frame: {
    flexGrow: 1,
    borderWidth: MODERN.frame.border,
    borderColor: "#000000",
    paddingHorizontal: MODERN.frame.paddingX,
    paddingTop: MODERN.frame.paddingTop,
    paddingBottom: MODERN.frame.paddingBottom,
    alignItems: "center",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: MODERN.title.size,
    textAlign: "center",
  },
  subject: {
    fontFamily: "Times-Bold",
    fontSize: MODERN.subject.size,
    textAlign: "center",
  },
  submittedRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  submittedToBlock: {
    marginLeft: MODERN.submitted.blockMarginX,
  },
  submittedByBlock: {
    marginRight: MODERN.submitted.blockMarginX,
  },
  submittedLabel: {
    fontFamily: "Times-Roman",
    fontSize: MODERN.submitted.labelSize,
    marginBottom: MODERN.submitted.gapBelowLabel,
  },
  detailValue: {
    fontFamily: "Times-Bold",
    fontSize: MODERN.submitted.valueSize,
    marginBottom: MODERN.submitted.rowGap,
  },
  teacherLine: {
    width: MODERN.submitted.teacherLineWidth,
    height: 1,
    backgroundColor: "#a1a1aa",
  },
});

export function ModernDocument({ data }: DocumentProps) {
  return (
    <Document
      title={`${data.assignmentNumber} — ${data.subject}`}
      author={data.studentName}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.frame}>
          <View style={{ flexGrow: MODERN.flex.top }} />

          <Text style={styles.title}>{data.assignmentNumber}</Text>

          <View style={{ height: MODERN.title.gapBelow }} />

          <Text style={styles.subject}>{data.subject}</Text>

          <View style={{ flexGrow: MODERN.flex.middle }} />

          <View style={styles.submittedRow}>
            {/* Submitted to — teacher (left) */}
            <View style={styles.submittedToBlock}>
              <Text style={styles.submittedLabel}>Submitted to</Text>
              {data.submittedToName.trim() ? (
                <View>
                  <Text style={styles.detailValue}>{data.submittedToName}</Text>
                  {data.submittedToDepartment.trim() ? (
                    <Text style={[styles.detailValue, { marginBottom: 0 }]}>
                      {data.submittedToDepartment}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View style={styles.teacherLine} />
              )}
            </View>

            {/* Submitted by — student (right) */}
            <View style={styles.submittedByBlock}>
              <Text style={styles.submittedLabel}>Submitted by</Text>
              <Text style={styles.detailValue}>{data.studentName}</Text>
              <Text style={styles.detailValue}>{data.rollNumber}</Text>
              <Text style={styles.detailValue}>{data.department}</Text>
              <Text style={[styles.detailValue, { marginBottom: 0 }]}>
                {data.semester}
              </Text>
            </View>
          </View>

          <View style={{ flexGrow: MODERN.flex.bottom }} />
        </View>
      </Page>
    </Document>
  );
}
