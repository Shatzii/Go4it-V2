import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Activity,
  Star,
  Clock,
  CheckCircle2,
  Zap,
  Flame,
  Medal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface XpTransaction {
  id: number;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
  multiplier?: number;
  source_id?: string;
}

interface XpTransactionsCardProps {
  transactions: XpTransaction[];
}

export default function XpTransactionsCard({ transactions }: XpTransactionsCardProps) {
  // Sort transactions by date (newest first)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [transactions]);

  // Get icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case "workout": return <Activity className="h-4 w-4" />;
      case "login": return <Clock className="h-4 w-4" />;
      case "challenge": return <Trophy className="h-4 w-4" />;
      case "video_analysis": return <BarChart3 className="h-4 w-4" />;
      case "assessment": return <CheckCircle2 className="h-4 w-4" />;
      case "streak": return <Flame className="h-4 w-4" />;
      case "ai_coach": return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  // Get color variant for transaction type
  const getVariant = (type: string) => {
    switch(type) {
      case "challenge": return "default";
      case "streak": return "destructive";
      case "login": return "secondary";
      case "assessment": return "outline";
      default: return "outline";
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          XP Transactions
        </CardTitle>
        <CardDescription>
          Recent activities and earned experience points
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Medal className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No XP transactions yet.</p>
            <p className="text-sm">Complete challenges and activities to earn XP!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Badge variant={getVariant(transaction.transaction_type)} className="flex items-center gap-1">
                      {getTransactionIcon(transaction.transaction_type)}
                      <span className="capitalize">
                        {transaction.transaction_type.replace('_', ' ')}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={transaction.description}>
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {formatDate(transaction.created_at)}
                  </TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <span>+{transaction.amount} XP</span>
                      {transaction.multiplier && transaction.multiplier > 1 && (
                        <Badge variant="outline" className="ml-2 px-1 py-0 h-5">
                          {transaction.multiplier}x
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}