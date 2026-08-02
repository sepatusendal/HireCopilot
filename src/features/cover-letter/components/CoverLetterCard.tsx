import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CoverLetter } from "@prisma/client";

export function CoverLetterCard({ coverLetter }: { coverLetter: CoverLetter }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{coverLetter.label}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Updated {coverLetter.updatedAt.toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{coverLetter.content}</p>
      </CardContent>
    </Card>
  );
}
