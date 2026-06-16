import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Activity, Droplets, Apple, Dumbbell,
  Heart, Baby, AlertTriangle, BarChart3, Settings,
  ChevronLeft, ChevronRight, Stethoscope, HeartPulse,
  Bell, User, Search, Menu, X, Sparkles, Shield
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/health-score', icon: Activity, label: 'Health Score' },
  { path: '/symptoms/select', icon: Stethoscope, label: 'Symptoms' },
  { path: '/water', icon: Droplets, label: 'Water' },
  { path: '/diet/plan', icon: Apple, label: 'Diet' },
  { path: '/exercise/recommendations', icon: Dumbbell, label: 'Exercise' },
  { path: '/first-aid', icon: HeartPulse, label: 'First Aid' },
  { path: '/doctor/recommendation', icon: Stethoscope, label: 'Doctor' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency', danger: true },
  { path: '/women/dashboard', icon: Heart, label: "Women's Health", fem: true },
  { path: '/pregnancy/dashboard', icon: Baby, label: 'Pregnancy', preg: true },
  { path: '/analytics/progress', icon: BarChart3, label: 'Analytics' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/settings/profile', icon: Settings, label: 'Settings' },
];

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/health-score', icon: Activity, label: 'Health' },
  { path: '/symptoms/select', icon: Stethoscope, label: 'Symptoms' },
  { path: '/women/dashboard', icon: Heart, label: 'Women' },
  { path: '/settings/profile', icon: Settings, label: 'More' },
];

// ━━━ SIDEBAR ━━━
export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        background: 'rgba(4, 13, 31, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
      className="hidden md:flex"
    >
      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--glass-border)',
        minHeight: 64,
      }}>
        <motion.div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00F5FF, #39FF14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          animate={{ boxShadow: ['0 0 12px rgba(0,245,255,0.3)', '0 0 24px rgba(0,245,255,0.6)', '0 0 12px rgba(0,245,255,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles size={20} color="#020510" />
        </motion.div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-display"
              style={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}
            >
              HealthGenie
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/'));
          const Icon = item.icon;
          const accentColor = item.danger ? 'var(--neon-warn)' :
                             item.fem ? 'var(--neon-fem)' :
                             item.preg ? 'var(--neon-preg)' :
                             'var(--neon-pulse)';
          return (
            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: isActive ? `${accentColor}15` : 'transparent',
                  border: isActive ? `1px solid ${accentColor}30` : '1px solid transparent',
                  transition: 'all 0.2s',
                  minHeight: 42,
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: isActive ? accentColor : 'var(--text-secondary)',
                    filter: isActive ? `drop-shadow(0 0 6px ${accentColor})` : 'none',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                  }}
                />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Expand Toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--glass-border)' }}>
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '100%',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'rgba(0, 245, 255, 0.05)',
            border: '1px solid var(--glass-border)',
            borderRadius: 10,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </motion.button>
      </div>
    </motion.aside>
  );
}

// ━━━ TOP BAR ━━━
export function TopBar({ healthScore = 72 }) {
  const unreadCount = 3;
  const scoreColor = healthScore >= 80 ? '#39FF14' : healthScore >= 50 ? '#00F5FF' : '#BF5FFF';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 72,
        height: 64,
        background: 'rgba(4, 13, 31, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
      }}
      className="hidden md:flex"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          position: 'relative',
          padding: '8px 16px',
          background: 'rgba(10, 25, 60, 0.4)',
          borderRadius: 12,
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 240,
        }}>
          <Search size={16} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search HealthGenie..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontFamily: 'Inter',
              width: '100%',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Mini Health Orb */}
        <motion.div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${scoreColor}, ${scoreColor}44)`,
            boxShadow: `0 0 12px ${scoreColor}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          animate={{
            boxShadow: [`0 0 8px ${scoreColor}40`, `0 0 20px ${scoreColor}80`, `0 0 8px ${scoreColor}40`],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-data" style={{ fontSize: '0.55rem', color: '#020510', fontWeight: 700 }}>
            {healthScore}
          </span>
        </motion.div>

        {/* Notification Bell */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--neon-warn)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {unreadCount}
            </motion.div>
          )}
        </motion.div>

        {/* Profile Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--neon-pulse), var(--neon-health))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px solid rgba(0, 245, 255, 0.3)',
          }}
        >
          <User size={18} color="#020510" />
        </motion.div>
      </div>
    </div>
  );
}

// ━━━ BOTTOM NAV (Mobile) ━━━
export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
        background: 'rgba(4, 13, 31, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 100,
      }}
      className="md:hidden"
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.path.split('/').slice(0, 2).join('/'));
        return (
          <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '8px 12px',
                borderRadius: 12,
                position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  style={{
                    position: 'absolute',
                    top: -1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 3,
                    borderRadius: 2,
                    background: 'var(--neon-pulse)',
                    boxShadow: '0 0 8px var(--neon-pulse)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                style={{
                  color: isActive ? 'var(--neon-pulse)' : 'var(--text-secondary)',
                  filter: isActive ? 'drop-shadow(0 0 4px var(--neon-pulse))' : 'none',
                }}
              />
              <span style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--neon-pulse)' : 'var(--text-secondary)',
              }}>
                {item.label}
              </span>
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default { Sidebar, TopBar, BottomNav };
