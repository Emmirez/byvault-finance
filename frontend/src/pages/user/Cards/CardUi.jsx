// src/components/Card.jsx
import React from "react";
import { CreditCard, MoreVertical, Lock, CheckCircle } from "lucide-react";

const Card = ({ card, onViewDetails }) => {
  const getCardGradient = (type) => {
    switch (type) {
      case "visa":
        return "from-blue-600 to-blue-800";
      case "mastercard":
        return "from-orange-500 to-red-600";
      case "amex":
        return "from-cyan-600 to-blue-700";
      default:
        return "from-gray-700 to-gray-900";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Active</span>;
      case "pending":
        return <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><Lock size={12} /> Pending</span>;
      case "blocked":
        return <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><Lock size={12} /> Blocked</span>;
      case "rejected":
        return <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`bg-gradient-to-br ${getCardGradient(card.cardType)} rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105`}
      onClick={() => onViewDetails(card)}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs opacity-80">{card.cardBrand === "virtual" ? "Virtual Card" : "Physical Card"}</p>
          <p className="text-lg font-bold">{card.cardholderName}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(card.status)}
          <button className="p-1 hover:bg-white/20 rounded-full">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xl font-mono tracking-wider">
          {card.status === "active" ? card.maskedNumber : "**** **** **** ****"}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs opacity-80">Expires</p>
          <p className="font-mono">{card.expiryMonth}/{card.expiryYear}</p>
        </div>
        <div className="text-right">
          <CreditCard size={32} className="opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default Card;