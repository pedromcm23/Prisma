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

type Props = {
  propertyId: string;
  onBack: () => void;
  /** Optional initial Unlayer design JSON (loaded when the editor is ready) */
  initialDesign?: Record<string, any> | null;
};

export function UnlayerEditor({ propertyId, onBack, initialDesign }: Props) {
  const emailEditorRef = useRef<EditorRef>(null);

  const saveDesign = async () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;

    unlayer.exportHtml(async (data: any) => {
      const { design, html } = data;
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
    console.log("Unlayer editor is ready");
    // If an initial design JSON was passed, load it into Unlayer
    if (initialDesign && emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.loadDesign(initialDesign);
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between p-4 bg-white border-b-2 border-foreground shadow-hard-sm z-10">
        <Button variant="outline" onClick={onBack} className="border-2 border-foreground font-bold">
          ← Back to Preview
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
            displayMode: 'web',
          }}
          style={{ minHeight: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
