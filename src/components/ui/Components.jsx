import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// ━━━ GLASS CARD ━━━
export function GlassCard({ children, className = '', hover = true, onClick, neon = false, style = {} }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !hover) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
    cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
  }, [hover]);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card ${neon ? 'neon-border' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={hover ? { y: -4, transition: { type: 'spring', stiffness: 300 } } : {}}
      style={{
        ...style,
        background: 'var(--glass-surface)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(0, 245, 255, 0.06), transparent 60%)',
            pointerEvents: 'none',
            borderRadius: '20px',
            zIndex: 1,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}

// ━━━ METAL CARD ━━━
export function MetalCard({ children, className = '', style = {} }) {
  return (
    <div className={`metal-card ${className}`} style={style}>
      {children}
    </div>
  );
}

// ━━━ GLASS BUTTON ━━━
export function GlassButton({ children, variant = 'default', onClick, disabled, className = '', type = 'button', fullWidth = false }) {
  const variantClass = {
    default: 'glass-btn',
    primary: 'glass-btn glass-btn-primary',
    danger: 'glass-btn glass-btn-danger',
    fem: 'glass-btn glass-btn-fem',
    preg: 'glass-btn glass-btn-preg',
  }[variant] || 'glass-btn';

  return (
    <motion.button
      type={type}
      className={`${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}

// ━━━ GLASS INPUT ━━━
export function GlassInput({ label, error, icon: Icon, ...props }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label className="text-eyebrow" style={{ display: 'block', marginBottom: 8 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              zIndex: 2,
            }}
          />
        )}
        <input
          className={`glass-input ${error ? 'glass-input-error' : ''}`}
          style={Icon ? { paddingLeft: 44 } : {}}
          {...props}
        />
      </div>
      {error && (
        <p style={{ color: 'var(--neon-warn)', fontSize: '0.78rem', marginTop: 4, fontFamily: 'Inter' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ━━━ ANIMATED TOGGLE ━━━
export function AnimatedToggle({ active, onToggle, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      {label && <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{label}</span>}
      <motion.div
        className={`toggle-switch ${active ? 'active' : ''}`}
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
}

// ━━━ PROGRESS RING ━━━
export function ProgressRing({ value = 0, max = 100, size = 120, strokeWidth = 8, color = 'var(--neon-pulse)', bgColor = 'rgba(100, 180, 255, 0.1)', children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        {children}
      </div>
    </div>
  );
}

// ━━━ ANIMATED COUNTER ━━━
export function AnimatedCounter({ value, suffix = '', prefix = '', className = '' }) {
  return (
    <motion.span
      className={`font-data ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

// ━━━ SKELETON LOADER ━━━
export function SkeletonLoader({ width = '100%', height = 20, borderRadius = 12, count = 1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width, height, borderRadius }}
        />
      ))}
    </div>
  );
}

// ━━━ PAGE TRANSITION WRAPPER ━━━
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ━━━ SECTION HEADER ━━━
export function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ textAlign: align, marginBottom: 32 }}
    >
      {eyebrow && <p className="text-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</p>}
      <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {subtitle && (
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, maxWidth: 600, margin: align === 'center' ? '8px auto 0' : '8px 0 0' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ━━━ CHIP ━━━
export function Chip({ label, active, onClick, variant = 'default', removable, onRemove }) {
  const variantClass = {
    default: 'chip',
    danger: 'chip chip-danger',
    fem: 'chip chip-fem',
    preg: 'chip chip-preg',
  }[variant];

  return (
    <motion.span
      className={`${variantClass} ${active ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      {removable && (
        <span
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          style={{ marginLeft: 4, cursor: 'pointer', opacity: 0.7 }}
        >
          ×
        </span>
      )}
    </motion.span>
  );
}

// ━━━ EMPTY STATE ━━━
export function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        textAlign: 'center',
        padding: '60px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {Icon && <Icon size={64} style={{ color: 'var(--neon-pulse)', opacity: 0.5 }} />}
      <h3 className="font-display" style={{ fontSize: '1.3rem', fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>{description}</p>
      {action && (
        <GlassButton variant="primary" onClick={onAction}>
          {action}
        </GlassButton>
      )}
    </motion.div>
  );
}

// ━━━ NEURAL PROCESSING ANIMATION ━━━
export function NeuralProcessing({ text = 'HealthGenie is analyzing...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: '2px solid',
              borderColor: 'var(--neon-pulse)',
              borderRadius: '50%',
              opacity: 0.3,
            }}
            animate={{ 
              rotate: 360, 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2] 
            }}
            transition={{
              rotate: { duration: 3 + i, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 },
            }}
          />
        ))}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: 6,
        }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--neon-pulse)',
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
      <motion.p
        className="font-display"
        style={{ color: 'var(--neon-pulse)', fontSize: '1rem', fontWeight: 500 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}

// ━━━ AI MESSAGE BUBBLE ━━━
export function AIMessageBubble({ content, isUser = false, isStreaming = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '12px 18px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isUser
            ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(57, 255, 20, 0.1))'
            : 'var(--glass-surface)',
          border: `1px solid ${isUser ? 'rgba(0, 245, 255, 0.3)' : 'var(--glass-border)'}`,
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
        }}
      >
        {content}
        {isStreaming && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ color: 'var(--neon-pulse)' }}
          >
            ▊
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

// ━━━ STREAK BADGE ━━━
export function StreakBadge({ count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <motion.span
        className="streak-flame"
        style={{ fontSize: '1.5rem' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        🔥
      </motion.span>
      <span className="font-data" style={{ fontSize: '1.2rem', color: 'var(--neon-warn)' }}>
        {count}
      </span>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>day streak</span>
    </div>
  );
}
