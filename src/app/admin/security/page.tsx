import prisma from '@/lib/prisma';

export default async function SecurityCenter() {
  const logs = await prisma.securityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'WARNING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">مركز الأمن السيبراني</h2>
          <p className="text-[var(--text-secondary)] italic text-sm">مراقبة التهديدات والنشاطات المشبوهة في الوقت الفعلي</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[var(--bg-card)] p-4 rounded-[18px] border border-[var(--border-color)] text-center shadow-sm min-w-[120px]">
            <span className="block text-[0.7rem] text-[var(--text-secondary)] font-bold mb-1">إجمالي التهديدات</span>
            <span className="text-xl font-black text-[var(--brand-primary)]">{logs.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-[24px] border border-[var(--border-color)] overflow-hidden shadow-lg backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                <th className="p-4 px-6 text-[0.85rem] font-bold text-[var(--text-secondary)]">الوقت</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold text-[var(--text-secondary)]">العنوان (IP)</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold text-[var(--text-secondary)]">الحدث</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold text-[var(--text-secondary)]">الخطورة</th>
                <th className="p-4 px-6 text-[0.85rem] font-bold text-[var(--text-secondary)]">المتصفح</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[var(--border-color)] hover:bg-[var(--brand-primary)]/5 transition-colors group">
                  <td className="p-4 px-6">
                    <span className="text-[0.85rem] font-medium text-[var(--text-primary)] whitespace-nowrap">
                      {formatDate(new Date(log.createdAt))}
                    </span>
                  </td>
                  <td className="p-4 px-6">
                    <span className="text-[0.85rem] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/5 p-1 px-3 rounded-full">
                      {log.ip}
                    </span>
                  </td>
                  <td className="p-4 px-6">
                    <span className="text-[0.85rem] font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                      {log.event}
                    </span>
                  </td>
                  <td className="p-4 px-6">
                    <span className={`text-[0.7rem] font-black p-1 px-3 rounded-lg border ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4 px-6 max-w-[200px] truncate">
                    <span className="text-[0.75rem] text-[var(--text-secondary)] italic">
                      {log.userAgent || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <img src="https://img.icons8.com/fluency/256/guarantee.png" width={100} height={100} alt="Safe" />
                      <span className="text-xl font-bold text-[var(--text-primary)]">لا توجد تهديدات مسجلة. النظام آمن تماماً!</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
