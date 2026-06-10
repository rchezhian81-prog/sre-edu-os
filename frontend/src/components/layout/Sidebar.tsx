"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { ROLE_ACCENT, ROLES_LABELS } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

interface NavItem { href: string; icon: string; label: string; badge?: number; }

const NAV: Record<string, NavItem[]> = {
  owner: [
    { href:'/owner', icon:'🏠', label:'Dashboard' }, { href:'/owner/branches', icon:'🏫', label:'Branches' },
    { href:'/owner/analytics', icon:'📊', label:'Analytics' }, { href:'/owner/settings', icon:'⚙️', label:'Settings' },
  ],
  admin: [
    { href:'/admin', icon:'🏠', label:'Dashboard' }, { href:'/admin/students', icon:'👨‍🎓', label:'Students' },
    { href:'/admin/staff', icon:'👨‍🏫', label:'Staff' }, { href:'/admin/attendance', icon:'✅', label:'Attendance' },
    { href:'/admin/fees', icon:'💳', label:'Fees' }, { href:'/admin/academics', icon:'📚', label:'Academics' },
    { href:'/admin/exam', icon:'📝', label:'Exams' }, { href:'/admin/timetable', icon:'📅', label:'Timetable' },
    { href:'/admin/reports', icon:'📈', label:'Reports' },
  ],
  teacher: [
    { href:'/teacher', icon:'🏠', label:'Dashboard' }, { href:'/teacher/attendance', icon:'✅', label:'Attendance' },
    { href:'/teacher/marks', icon:'📝', label:'Marks Entry' }, { href:'/teacher/timetable', icon:'📅', label:'Timetable' },
    { href:'/teacher/students', icon:'👨‍🎓', label:'My Students' },
  ],
  student: [
    { href:'/student', icon:'🏠', label:'Dashboard' }, { href:'/student/attendance', icon:'✅', label:'Attendance' },
    { href:'/student/results', icon:'📝', label:'Results' }, { href:'/student/fees', icon:'💳', label:'Fees' },
    { href:'/student/timetable', icon:'📅', label:'Timetable' }, { href:'/student/library', icon:'📚', label:'Library' },
  ],
  parent: [
    { href:'/parent', icon:'🏠', label:'Dashboard' }, { href:'/parent/attendance', icon:'✅', label:'Attendance' },
    { href:'/parent/results', icon:'📝', label:'Results' }, { href:'/parent/fees', icon:'💳', label:'Pay Fees' },
    { href:'/parent/transport', icon:'🚌', label:'Bus Tracking' }, { href:'/parent/messages', icon:'💬', label:'Messages' },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const role = user?.role ?? 'student';
  const accent = ROLE_ACCENT[role] ?? '#1871E9';
  const items = NAV[role] ?? NAV.student;
  const roleSection = role === 'owner' ? role : role === 'admin' ? role : role === 'teacher' ? role : role === 'parent' ? role : 'student';

  return (
    <aside className="w-[220px] min-h-screen bg-sur flex flex-col fixed top-0 left-0 bottom-0 z-50 border-r border-clay/25"
           style={{ boxShadow:'-8px -8px 16px #FFFFFF, 8px 8px 16px #A3B1C6' }}>
      {/* Logo */}
      <div className="p-4 border-b border-clay/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
               style={{ background:`linear-gradient(135deg, ${accent}, ${accent}CC)`, boxShadow:`0 4px 12px ${accent}60` }}>
            {role[0].toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-sm text-gray-800">SRE EDU OS</div>
            <div className="text-xs font-bold mt-0.5 px-2 py-0.5 rounded-full inline-block"
                 style={{ background:'var(--sur)', boxShadow:'inset -2px -2px 5px #FFFFFF, inset 2px 2px 5px #A3B1C6', color:accent, fontSize:'9px', letterSpacing:'0.5px', textTransform:'uppercase' }}>
              {ROLES_LABELS[role]}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {items.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={cn('flex items-center gap-2.5 mx-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5',
                active ? 'shadow-neu-sink-sm font-semibold' : 'text-gray-500 hover:shadow-neu-raise-sm hover:text-gray-800')}
              style={active ? { color:accent } : {}}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && <span className="text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-clay/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
               style={{ background:`linear-gradient(135deg, ${accent}, ${accent}CC)`, boxShadow:'inset -2px -2px 5px rgba(255,255,255,.3)' }}>
            {user?.fullName?.[0] ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-800 truncate">{user?.fullName ?? 'User'}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 text-lg transition-colors" title="Logout">↩</button>
        </div>
      </div>
    </aside>
  );
}
