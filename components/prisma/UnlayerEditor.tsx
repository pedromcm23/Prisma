"use client";

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { savePropertyDesign } from '@/app/actions/property';

// Types workaround since we use dynamic import
type EditorRef = {
  editor: any;
};

const EmailEditor = dynamic(() => import('react-email-editor'), { ssr: false });

export function UnlayerEditor({ propertyId, onBack }: { propertyId: string, onBack: () => void }) {
  const emailEditorRef = useRef<EditorRef>(null);

  const saveDesign = async () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    unlayer.exportHtml(async (data: any) => {
      const { design, html } = data; // design is the JSON
      try {
        await savePropertyDesign(propertyId, design, html);
        alert("Design saved successfully!");
      } catch (e) {
        console.error(e);
        alert("Failed to save design.");
      }
    });
  };

  const onReady = () => {
    // Unlayer is ready
    console.log("Unlayer editor is ready");
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between p-4 bg-white border-b-2 border-foreground shadow-hard-sm z-10">
        <Button variant="outline" onClick={onBack} className="border-2 border-foreground font-bold">
          ← Back to Wizard
        </Button>
        <h2 className="font-display font-bold text-xl">Prisma Web Builder</h2>
        <Button onClick={saveDesign} className="bg-primary text-primary-foreground border-2 border-foreground shadow-hard hover:bg-primary/90 font-bold">
          Save & Publish
        </Button>
      </div>
      
      <div className="flex-1 w-full bg-cream relative">
        <EmailEditor
          ref={emailEditorRef as any}
          onReady={onReady}
          projectId={Number(process.env.NEXT_PUBLIC_UNLAYER_PROJECT_ID) || undefined}
          options={{
            displayMode: 'web', // Force web mode
            theme: 'light',
          }}
          style={{ minHeight: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
