import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { JSONContent, Editor } from '@tiptap/react';
import { useAppraisal } from './useAppraisal';
import { useAutoSave } from './useAutoSave';
import { SubjectPropertyForm } from './SubjectPropertyForm';
import { SectionNav } from './SectionNav';
import { VersionHistoryDropdown } from './VersionHistoryDropdown';
import { AiDescriptionPanel } from '@/features/ai/AiDescriptionPanel';
import { useGenerateDescription } from '@/features/ai/useGenerateDescription';
import './editor.css';

function SaveStatus({ saving, lastSaved }: { saving: boolean; lastSaved: Date | null }) {
  if (saving) {
    return <span className="text-sm text-fog">Saving...</span>;
  }
  if (lastSaved) {
    return <span className="text-sm text-sage">Saved</span>;
  }
  return <span className="text-sm text-gold">Unsaved changes</span>;
}

interface ToolbarProps {
  editor: Editor | null;
}

function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const buttonBase =
    'border border-fog/20 rounded-[8px] px-2 py-1 text-sm font-sans cursor-pointer transition-colors';
  const activeClass = 'bg-ink text-parchment';
  const inactiveClass = 'bg-white text-slate hover:bg-parchment';

  const buttons = [
    { label: 'Bold', action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
    { label: 'Italic', action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
    { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }) },
    { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }) },
    { label: 'Bullet list', action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
    { label: 'Ordered list', action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
  ];

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={`${buttonBase} ${btn.isActive ? activeClass : inactiveClass}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: appraisal, isLoading, error } = useAppraisal(id ?? '');
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [activeSection, setActiveSection] = useState('subject');
  const { generate, generating, generatedText, error: aiError, reset: resetAi, updateUserAction } = useGenerateDescription();

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: (appraisal?.document_content as JSONContent) ?? { type: 'doc', content: [] },
      immediatelyRender: false,
      onUpdate: ({ editor: ed }) => {
        setContent(ed.getJSON());
      },
    },
    [appraisal?.document_content],
  );

  const { saving, lastSaved } = useAutoSave(id ?? '', content);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Loading appraisal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-flag font-medium">Failed to load appraisal</p>
          <p className="text-fog text-sm mt-2">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (!appraisal) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Appraisal not found</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Section navigation */}
      <div className="hidden lg:block w-44 shrink-0 pt-2">
        <SectionNav activeSection={activeSection} onSectionClick={setActiveSection} />
      </div>

      {/* Main editor area */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-[22px] font-medium text-ink">
            {appraisal.property_address || 'Untitled appraisal'}
          </h1>
          <div className="flex items-center gap-4">
            <SaveStatus saving={saving} lastSaved={lastSaved} />
            <VersionHistoryDropdown appraisalId={id ?? ''} />
          </div>
        </div>

        {/* Subject property form */}
        <div id="section-subject">
          <SubjectPropertyForm
            appraisalId={id ?? ''}
            initialData={{
              property_address: appraisal.property_address,
              property_city: appraisal.property_city,
              property_state: appraisal.property_state,
              property_zip: appraisal.property_zip,
              property_type: appraisal.property_type,
              bedrooms: appraisal.bedrooms,
              bathrooms: appraisal.bathrooms,
              gla: appraisal.gla,
              lot_size: appraisal.lot_size,
              year_built: appraisal.year_built,
              condition: appraisal.condition,
            }}
          />
        </div>

        {/* AI description generator */}
        <AiDescriptionPanel
          generating={generating}
          generatedText={generatedText}
          error={aiError}
          hasSubjectData={!!(appraisal.property_address || appraisal.bedrooms || appraisal.gla)}
          onGenerate={() => {
            void generate({
              appraisal_id: id ?? '',
              property_address: appraisal.property_address,
              property_city: appraisal.property_city,
              property_state: appraisal.property_state,
              property_zip: appraisal.property_zip,
              property_type: appraisal.property_type,
              bedrooms: appraisal.bedrooms,
              bathrooms: appraisal.bathrooms,
              gla: appraisal.gla,
              lot_size: appraisal.lot_size,
              year_built: appraisal.year_built,
              condition: appraisal.condition,
            });
          }}
          onAccept={() => {
            if (generatedText && editor) {
              editor.chain().focus().insertContent(`<p>${generatedText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`).run();
              void updateUserAction(id ?? '', 'accepted');
              resetAi();
            }
          }}
          onReject={() => {
            void updateUserAction(id ?? '', 'rejected');
            resetAi();
          }}
          onRegenerate={() => {
            void updateUserAction(id ?? '', 'regenerated');
            void generate({
              appraisal_id: id ?? '',
              property_address: appraisal.property_address,
              property_city: appraisal.property_city,
              property_state: appraisal.property_state,
              property_zip: appraisal.property_zip,
              property_type: appraisal.property_type,
              bedrooms: appraisal.bedrooms,
              bathrooms: appraisal.bathrooms,
              gla: appraisal.gla,
              lot_size: appraisal.lot_size,
              year_built: appraisal.year_built,
              condition: appraisal.condition,
            });
          }}
        />

        {/* TipTap editor */}
        <div id="section-neighborhood" className="bg-white border border-fog/20 rounded-[12px] p-8 min-h-[600px]">
          <Toolbar editor={editor} />
          <div className="tiptap-editor font-sans text-slate text-base leading-relaxed">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
