import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { Group } from "@/types";
import Link from "next/link";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group._id}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={group.avatarUrl} alt={group.name} />
            <AvatarFallback>
              <Users />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{group.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {group.description}
          </p>
          <div className="text-xs text-muted-foreground mt-2">
            {group.memberCount} members
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}