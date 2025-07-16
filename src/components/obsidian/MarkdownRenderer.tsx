import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderedContent = useMemo(() => {
    // Simple markdown parsing - for production, consider using a library like marked or remark
    let html = content;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 fintech-text-header">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3 fintech-text-header">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 fintech-text-header">$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-muted/50 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-muted/50 px-2 py-1 rounded text-sm font-mono">$1</code>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal">$1. $2</li>');
    
    // Wrap consecutive list items
    html = html.replace(/(<li.*?<\/li>\s*)+/g, '<ul class="my-2 space-y-1">$&</ul>');

    // Checkboxes
    html = html.replace(/- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 my-1"><input type="checkbox" class="rounded" disabled /> <span>$1</span></div>');
    html = html.replace(/- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 my-1"><input type="checkbox" class="rounded" checked disabled /> <span class="line-through text-muted-foreground">$1</span></div>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-6 border-muted" />');

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">$1</blockquote>');

    return html;
  }, [content]);

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none fintech-text-secondary"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};