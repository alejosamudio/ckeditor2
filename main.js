/**
 * CKEditor 5 + Bubble Bridge — Debug Version
 * ------------------------------------------
 * This version adds full logging so we can diagnose:
 *  - whether main.js loads
 *  - whether CKEditor initializes
 *  - whether window.editor is created
 *  - whether CONTENT_UPDATE triggers
 */

console.log("🟦 MAIN.JS LOADED");

// Debug DOM readiness
document.addEventListener("DOMContentLoaded", () => {
	console.log("🟩 DOM READY — #editor:", document.querySelector("#editor"));
});

/**
 * CKEditor plugins (generated via CKBuilder)
 */
const {
	DecoupledEditor,
	Autosave,
	Essentials,
	Paragraph,
	CloudServices,
	Autoformat,
	TextTransformation,
	LinkImage,
	Link,
	ImageBlock,
	ImageToolbar,
	BlockQuote,
	Bold,
	Bookmark,
	CKBox,
	ImageUpload,
	ImageInsert,
	ImageInsertViaUrl,
	AutoImage,
	PictureEditing,
	CKBoxImageEdit,
	CodeBlock,
	TableColumnResize,
	Table,
	TableToolbar,
	Emoji,
	Mention,
	PasteFromOffice,
	FindAndReplace,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	HorizontalLine,
	ImageCaption,
	ImageResize,
	ImageStyle,
	Indent,
	IndentBlock,
	Code,
	Italic,
	AutoLink,
	ListProperties,
	List,
	MediaEmbed,
	RemoveFormat,
	SpecialCharactersArrows,
	SpecialCharacters,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Subscript,
	Superscript,
	TableCaption,
	TableCellProperties,
	TableProperties,
	Alignment,
	TodoList,
	Underline,
	BalloonToolbar
} = window.CKEDITOR;

const {
	AIChat,
	AIEditorIntegration,
	AIQuickActions,
	AIReviewMode,
	PasteFromOfficeEnhanced,
	FormatPainter,
	LineHeight,
	RealTimeCollaborativeComments,
	RealTimeCollaborativeEditing,
	PresenceList,
	Comments,
	RealTimeCollaborativeTrackChanges,
	TrackChanges,
	TrackChangesData,
	TrackChangesPreview,
	SlashCommand
} = window.CKEDITOR_PREMIUM_FEATURES;


console.log("🟦 CKEDITOR UMD Loaded? ", !!window.CKEDITOR);
console.log("🟦 PREMIUM UMD Loaded? ", !!window.CKEDITOR_PREMIUM_FEATURES);

// Your real values
const LICENSE_KEY = "YOUR_LICENSE_KEY_HERE";
const DOCUMENT_ID = "fv-doc-1";
const CLOUD_SERVICES_TOKEN_URL =
	"https://uplnolydjmzr.cke-cs.com/token/dev/9dcdd882883e3315126ce6f9865e9ec42fa58287442ece2a12be481798c5?limit=10";
const CLOUD_SERVICES_WEBSOCKET_URL = "wss://uplnolydjmzr.cke-cs.com/ws";


// --------------------------------------------------------
// Editor Config
// --------------------------------------------------------
const editorConfig = {
	toolbar: {
		items: [
			"undo",
			"redo",
			"|",
			"trackChanges",
			"comment",
			"|",
			"toggleAi",
			"|",
			"formatPainter",
			"|",
			"heading",
			"|",
			"fontSize",
			"fontFamily",
			"fontColor",
			"fontBackgroundColor",
			"|",
			"bold",
			"italic",
			"underline",
			"|",
			"link",
			"insertImage",
			"insertTable",
			"blockQuote",
			"codeBlock",
			"|",
			"alignment",
			"lineHeight",
			"|",
			"bulletedList",
			"numberedList",
			"todoList",
			"outdent",
			"indent"
		]
	},

	plugins: [
		AIChat,
		AIEditorIntegration,
		AIQuickActions,
		AIReviewMode,
		Alignment,
		Autoformat,
		AutoImage,
		AutoLink,
		Autosave,
		BalloonToolbar,
		BlockQuote,
		Bold,
		Bookmark,
		CKBox,
		CKBoxImageEdit,
		CloudServices,
		Code,
		CodeBlock,
		Comments,
		Emoji,
		Essentials,
		FindAndReplace,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		FormatPainter,
		Heading,
		HorizontalLine,
		ImageBlock,
		ImageCaption,
		ImageInsert,
		ImageInsertViaUrl,
		ImageResize,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		Indent,
		IndentBlock,
		Italic,
		LineHeight,
		Link,
		LinkImage,
		List,
		ListProperties,
		MediaEmbed,
		Mention,
		Paragraph,
		PasteFromOffice,
		PasteFromOfficeEnhanced,
		PictureEditing,
		PresenceList,
		RealTimeCollaborativeComments,
		RealTimeCollaborativeEditing,
		RealTimeCollaborativeTrackChanges,
		RemoveFormat,
		SlashCommand,
		SpecialCharacters,
		SpecialCharactersArrows,
		SpecialCharactersCurrency,
		SpecialCharactersEssentials,
		SpecialCharactersLatin,
		SpecialCharactersMathematical,
		SpecialCharactersText,
		Strikethrough,
		Subscript,
		Superscript,
		Table,
		TableCaption,
		TableCellProperties,
		TableColumnResize,
		TableProperties,
		TableToolbar,
		TextTransformation,
		TodoList,
		TrackChanges,
		TrackChangesData,
		TrackChangesPreview,
		Underline
	],

	ai: {
		container: { type: "overlay", side: "right" }
	},

	cloudServices: {
		tokenUrl: CLOUD_SERVICES_TOKEN_URL,
		webSocketUrl: CLOUD_SERVICES_WEBSOCKET_URL
	},

	collaboration: {
		channelId: DOCUMENT_ID
	},

	presenceList: {
		container: document.querySelector("#editor-presence")
	},

	sidebar: {
		container: document.querySelector("#editor-annotations")
	},

	placeholder: "Type or paste your content here!",
	licenseKey: LICENSE_KEY
};


// --------------------------------------------------------
// CREATE EDITOR + DEBUG
// --------------------------------------------------------
console.log("🟦 Calling DecoupledEditor.create()...");

DecoupledEditor.create(document.querySelector("#editor"), editorConfig)
	.then(editor => {
		console.log("🟩 EDITOR CREATED SUCCESSFULLY", editor);

		// Add toolbar + menu bar
		document.querySelector("#editor-toolbar").appendChild(editor.ui.view.toolbar.element);
		document.querySelector("#editor-menu-bar").appendChild(editor.ui.view.menuBarView.element);

		// Expose globally
		window.editor = editor;
		window.suppressEditorEvents = false;

		// Send EDITOR_READY
		if (window.sendToParent) {
			console.log("🟦 SENDING EDITOR_READY → parent");
			window.sendToParent("EDITOR_READY", { timestamp: Date.now() });
		}

		// Listen for content updates
		editor.model.document.on("change:data", () => {
			if (window.suppressEditorEvents) return;

			const html = editor.getData();
			console.log("🟧 CONTENT_UPDATE fired:", html.slice(0, 80));

			if (window.sendToParent) {
				window.sendToParent("CONTENT_UPDATE", { html });
			}
		});

		return editor;
	})
	.catch(err => {
		console.error("❌ EDITOR FAILED TO INITIALIZE:", err);
	});


// --------------------------------------------------------
// TRIAL ALERT (CK Default)
// --------------------------------------------------------
function configUpdateAlert() {}
