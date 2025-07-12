import React from 'react';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

interface AnnetteRoleSwitchProps {
  className?: string;
}

const AnnetteRoleSwitch: React.FC<AnnetteRoleSwitchProps> = ({ className = "" }) => {
  const { currentRole } = useRoleSwitch();

  // Rare long joke trigger (very low chance)
  const shouldShowLongJoke = Math.random() < 0.02; // 2% chance

  const getRoleSwitchMessage = () => {
    if (shouldShowLongJoke) {
      return "Why did the leaf blower start a service business? Because it blew up on TikTok, hired 3 squirrels, and now it's booked until fall 🍂😂";
    }

    const messages = {
      customer: [
        "Switching gears, sugar? You're now browsing as a customer — go treat yourself! 💅",
        "Customer mode activated! Time to sit back and let someone else do the work 😎",
        "Welcome to the comfy side! Let's find you some stellar service providers 🌟"
      ],
      provider: [
        "Provider cape on! Let's go make some money, baby! 💸",
        "Time to hustle! Your expertise is about to pay off 🔧",
        "Provider mode enabled! Ready to show them what you're made of? 💪"
      ]
    };

    const roleMessages = messages[currentRole as keyof typeof messages] || messages.customer;
    return roleMessages[Math.floor(Math.random() * roleMessages.length)];
  };

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <div className="flex-1">
          <p className="text-purple-700 font-medium text-sm mb-1">Annette says:</p>
          <p className="text-purple-600 text-sm">
            {getRoleSwitchMessage()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnetteRoleSwitch;