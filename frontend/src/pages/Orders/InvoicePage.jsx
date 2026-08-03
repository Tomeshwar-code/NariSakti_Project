import { useEffect, useState } from 'react';
import { fetchInvoices, downloadInvoice } from '../../services/invoiceServices';

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices().then(res => setInvoices(res.data)).catch(() => {});
  }, []);

  const onDownload = async (id, number) => {
    try {
      const res = await downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Invoices</h2>
      <table>
        <thead>
          <tr><th>Invoice</th><th>Order</th><th>Date</th><th>Total</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv._id}>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.orderId}</td>
              <td>{new Date(inv.issueDate).toLocaleString()}</td>
              <td>{inv.total}</td>
              <td>
                <button onClick={() => onDownload(inv._id, inv.invoiceNumber)}>Download</button>
                <button onClick={() => window.print()}>Print</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
