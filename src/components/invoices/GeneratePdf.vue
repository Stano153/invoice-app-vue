<script setup>
import { computed } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts.vfs;

const props = defineProps({
  invoice: Object,
});

const invoiceData = computed(() => props.invoice || {});

const generatePDF = () => {
  if (!invoiceData.value || !invoiceData.value.id) {
    console.error("Chýbajú údaje faktúry");
    return;
  }

  const totalAmount = invoiceData.value.items?.reduce(
    (sum, item) => sum + (item.itemQty * item.itemPrice || 0),
    0
  ).toFixed(2);

  const docDefinition = {
    content: [
      { text: "CENOVÁ PONUKA", style: "header" },
      { text: `Číslo ponuky: ${invoiceData.value.id}`, style: "subheader" },
      { text: `DÁTUM VYTVORENIA: ${invoiceData.value.invoiceDate || "-"}`, style: "dateBox" },

      {
        columns: [
          {
            stack: [
              { text: "DODÁVATEĽ", style: "boxHeader" },
              {
                table: {
                  widths: ["*"],
                  body: [
                    [{ text: invoiceData.value.address?.name || "MiribleDesign", style: "boldText" }],
                    [{ text: `Ulica a číslo: ${invoiceData.value.address?.street || "-"}` }],
                    [{ text: `Mesto: ${invoiceData.value.address?.city || "-"}` }],
                    [{ text: `Krajina: ${invoiceData.value.address?.country || "-"}` }],
                    [{ text: `PSČ: ${invoiceData.value.address?.postalCode || "-"}` }],
                  ],
                },
                layout: "noBorders",
                margin: [0, 5, 0, 10],
              },
            ],
            margin: [0, 10, 10, 10],
          },
          {
            stack: [
              { text: "ODBERATEĽ", style: "boxHeader" },
              {
                table: {
                  widths: ["*"],
                  body: [
                    [{ text: invoiceData.value.billTo?.name || "-", style: "boldText" }],
                    [{ text: `Ulica a číslo: ${invoiceData.value.billTo.address?.street || "-"}` }],
                    [{ text: `Mesto: ${invoiceData.value.billTo.address?.city || "-"}` }],
                    [{ text: `Krajina: ${invoiceData.value.billTo.address?.country || "-"}` }],
                    [{ text: `PSČ: ${invoiceData.value.billTo.address?.postalCode || "-"}` }],
                  ],
                },
                layout: "noBorders",
                margin: [0, 5, 0, 10],
              },
            ],
            margin: [10, 10, 0, 10],
          },
        ],
      },


      { text: "Cenová ponuka:", style: "sectionTitle" },

      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto", "auto"],
          body: [
            [
              { text: "Názov a popis položky", style: "tableHeader" },
              { text: "Množstvo", style: "tableHeader" },
              { text: "Jednotka", style: "tableHeader" },
              { text: "Jedn. cena", style: "tableHeader" },
              { text: "Celkom EUR", style: "tableHeader" },
            ],
            ...(invoiceData.value.items || []).map((item) => [
              item.itemName || "-",
              item.itemQty || "0",
              "ks",
              `${item.itemPrice?.toFixed(2) || "0.00"} €`,
              `${(item.itemQty * item.itemPrice || 0).toFixed(2)} €`,
            ]),
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 10, 0, 10],
      },

      {
        text: `Celková suma: ${totalAmount} EUR`,
        style: "totalAmount",
      },
    ],

    styles: {
      header: {
        fontSize: 22,
        bold: true,
        color: "#007bff",
        alignment: "right",
        margin: [0, 0, 20, 5],
      },
      subheader: {
        fontSize: 14,
        color: "#b0b0b0",
        alignment: "right",
        margin: [0, 0, 20, 10],
      },
      boxHeader: {
        fontSize: 12,
        bold: true,
        color: "#007bff",
        fillColor: "#f0f3f5",
        padding: [10, 5, 10, 5],
      },
      boldText: {
        bold: true,
        fontSize: 11,
      },
      dateBox: {
        fontSize: 10,
        bold: true,
        fillColor: "#f0f3f5",
        margin: [0, 0, 20, 5],
        alignment: "right",
      },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: "white",
        fillColor: "#007bff",
        alignment: "center",
      },
      totalAmount: {
        fontSize: 14,
        bold: true,
        color: "white",
        fillColor: "#007bff",
        alignment: "right",
        margin: [0, 10, 0, 0],
        padding: [5, 5, 5, 5],
      },
    },
  };

  pdfMake.createPdf(docDefinition).download(`cenova_ponuka_${invoiceData.value.id}.pdf`);
};
</script>

<template>
  <div>
    <button @click="generatePDF" class="btn btn--purple">Download PDF</button>
  </div>
</template>

<style scoped>
div {
    margin-top: 10px;
}
</style>





