import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------- Styled Components ---------- */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Popup = styled(motion.div)`
  width: 320px;
  padding: 24px;
  border-radius: 20px;
  text-align: center;

  background: linear-gradient(
    145deg,
    rgba(16, 185, 129, 0.15),
    rgba(6, 78, 59, 0.35)
  );

  border: 1px solid rgba(16, 185, 129, 0.4);

  box-shadow:
    0 0 40px rgba(16, 185, 129, 0.45),
    inset 0 0 30px rgba(16, 185, 129, 0.1);
`;

const Trophy = styled.div`
  margin: 0 auto 12px;
  width: 56px;
  height: 56px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;

  background: rgba(16, 185, 129, 0.2);
  color: #34d399;

  box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #6ee7b7;
  margin-bottom: 4px;
`;

const Exercise = styled.p`
  font-size: 14px;
  color: #a7f3d0;
  opacity: 0.85;
`;

const Points = styled.div`
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #34d399;
`;

const CloseHint = styled.div`
  margin-top: 16px;
  font-size: 12px;
  opacity: 0.4;
  color: #d1fae5;
`;

/* ---------- Component ---------- */

export default function PRPopup({ open, onClose, exercise, points }) {
  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Popup
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            onClick={onClose}
          >
            <Trophy>🏆</Trophy>
            <Title>NEW PERSONAL RECORD</Title>
            <Exercise>{exercise}</Exercise>
            {points !== undefined && <Points>{points} Z-Points ⚡</Points>}
            <CloseHint>tap anywhere to continue</CloseHint>
          </Popup>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
