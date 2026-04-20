import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { fetchAdminAuditLogs } from "../../../services/api/adminApi";
import { useAuth } from "../../../app/auth/authContext";
import { useSocket } from "../../../app/auth/SocketProvider";
import { Card, Title, TextBlock } from "../../../components/ui";

export function ActivityFeed() {
  const { withAuthRequest } = useAuth();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminAuditLogs"],
    queryFn: async () => {
      const res = await withAuthRequest((token) => fetchAdminAuditLogs(token));
      return res?.data?.logs || [];
    },
    // Poll every 2 mins just in case socket misses
    refetchInterval: 120000,
  });

  useEffect(() => {
    if (!socket) return;
    const handleActivity = () => {
      // Invalidate the query so it fetches the new list
      queryClient.invalidateQueries({ queryKey: ["adminAuditLogs"] });
    };
    socket.on("new_activity", handleActivity);
    return () => socket.off("new_activity", handleActivity);
  }, [socket, queryClient]);

  if (isLoading) {
    return (
      <Card>
        <TextBlock>Loading activity feed...</TextBlock>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <TextBlock className="text-red-500">Failed to load activity logs.</TextBlock>
      </Card>
    );
  }

  const logs = data || [];

  return (
    <Card className="flex flex-col h-full max-h-[600px]">
      <div className="flex items-center gap-2 border-b border-[var(--amc-border)] pb-4 mb-4">
        <Activity className="text-[var(--amc-accent-500)]" size={24} />
        <Title as="h3" className="text-xl">Live Activity Feed</Title>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {logs.length === 0 ? (
          <TextBlock className="text-[var(--amc-text-muted)] italic">No recent activity.</TextBlock>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="relative pl-6 pb-2 border-l-2 border-[var(--amc-border)] last:border-0 last:pb-0">
              <span className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-[var(--amc-accent-400)]" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[var(--amc-text-strong)]">{log.action.replace(/_/g, " ")}</span>
                <span className="text-xs text-[var(--amc-text-body)]">
                  {log.actorEmail} on {log.targetType} <span className="text-[var(--amc-text-muted)]">({log.targetId})</span>
                </span>
                <span className="text-[10px] uppercase text-[var(--amc-text-muted)]">
                  {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                </span>
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <pre className="mt-1 p-2 text-[10px] bg-[var(--amc-bg-main)] rounded overflow-x-auto text-[var(--amc-text-muted)] border border-[var(--amc-border)]">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
