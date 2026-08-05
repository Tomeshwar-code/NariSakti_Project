import './WhatsAppWidget.css';

const WHATSAPP_NUMBER = '919876543210';
const MESSAGE = 'Hello NariSakti, I need help with my order and wallet.';

const WhatsAppWidget = () => {
  const chatUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <div className="whatsapp-widget glass-panel">
      <div className="whatsapp-content">
        <div>
          <p className="whatsapp-label">Need help?</p>
          <h3>Chat with us on WhatsApp</h3>
          <p>Get order support, wallet help, or product guidance instantly.</p>
        </div>
        <a href={chatUrl} target="_blank" rel="noreferrer" className="whatsapp-button">
          Chat Now
        </a>
      </div>
    </div>
  );
};

export default WhatsAppWidget;
