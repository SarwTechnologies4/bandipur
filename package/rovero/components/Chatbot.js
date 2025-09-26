// src/components/Shared/Chat/WhatsAppButton.jsx
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_BASE_URL;
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_CMS_TOKEN;

const useWhatsAppNumber = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/consumer/damauli_whatsapp_contact`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_AUTH_TOKEN}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch WhatsApp number");

        const data = await res.json();
        const number = data.data?.phonenumber; // Corrected property name
        console.log("WhatsApp Number:", number);
        setWhatsappNumber(number || "");
      } catch (err) {
        console.error("Error fetching WhatsApp number:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhatsAppNumber();
  }, []);

  return { whatsappNumber, loading };
};

const WhatsAppButton = () => {
  const { whatsappNumber, loading } = useWhatsAppNumber();

  // Don't render anything while loading or if no number is available
  if (loading || !whatsappNumber) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello, I would like to know more about Siddhartha Boutique Hotel, Bouddha."
  )}`;

  return (
    <>
      <a
        href={whatsappUrl}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          width="40"
          height="40"
        />
      </a>

      <style jsx>{`
        .whatsapp-float {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          width: 56px;
          height: 56px;
          background-color: #25D366;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
          transition: transform 0.2s ease-in-out;
        }

        .whatsapp-float:hover {
          transform: scale(1.1);
        }

        .whatsapp-float img {
          width: 32px;
          height: 32px;
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;