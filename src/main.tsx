import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { BrowserRouter } from "react-router-dom";

/* ── Shell ───────────────────────────────────────────────── */
import { AppShell, ShellMenuItem } from "@/theme/shell";

/* ── UI Components ───────────────────────────────────────── */
import { Button, ButtonGroup } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardBody, CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Spinner, SpinnerOverlay } from "@/components/ui/spinner";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogBody, DialogFooter, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { CollapseGroup, Collapse, CollapseTrigger, CollapseContent } from "@/components/ui/collapse";
import { ListGroup, ListGroupItem } from "@/components/ui/list-group";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

/* ── Icons ───────────────────────────────────────────────── */
import {
  LayoutDashboard, Users, Settings, FileText, Bell, HelpCircle,
  User, LogOut, BarChart, Home, ChevronRight, Mail, Phone,
  Download, Upload, Trash2, Edit3, Eye, Copy, Star, Heart,
  ArrowRight, Plus, Search, Filter, Check, Info, AlertTriangle,
  XCircle, CheckCircle2, Loader2, Palette, Code2, Box, Layers,
  Type, Sliders, ToggleLeft, Rows3, Navigation, Cpu, Zap,
  BookOpen, Globe, Lock, RefreshCw,
} from "lucide-react";

/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */

/** Monospace code block */
const Code = ({ children }: { children: string }) => (
  <pre className="bg-muted/60 dark:bg-muted/30 border border-border rounded-lg px-4 py-3 text-ds-xs font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed">
    <code>{children}</code>
  </pre>
);

/** Labelled row of variant chips */
const Row = ({ label, children }: { label?: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    {label && <p className="text-ds-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>}
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
);

/** Section wrapper */
interface SectionProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}
const Section = ({ id, icon: Icon, title, description, children }: SectionProps) => (
  <section
    id={id}
    className="scroll-mt-20 rounded-xl border border-border bg-card overflow-hidden"
  >
    {/* Section header */}
    <div className="flex items-start gap-4 px-6 py-4 border-b border-border bg-muted/20">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <h2 className="text-ds-base font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-ds-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="px-6 py-6 space-y-8">{children}</div>
  </section>
);

/** Demo + code two-column block */
const DemoBlock = ({ label, code, children }: { label: string; code: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <p className="text-ds-sm font-medium text-foreground">{label}</p>
    <div className="rounded-xl border border-border bg-background p-4">{children}</div>
    <Code>{code}</Code>
  </div>
);

/** Props table */
const PropsTable = ({ rows }: { rows: { prop: string; type: string; default: string; desc: string }[] }) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full text-ds-xs">
      <thead>
        <tr className="border-b border-border bg-muted/40">
          {["Prop", "Type", "Default", "Description"].map((h) => (
            <th key={h} className="px-4 py-2.5 text-left font-semibold text-foreground whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r) => (
          <tr key={r.prop} className="hover:bg-muted/20">
            <td className="px-4 py-2.5 font-mono text-primary whitespace-nowrap">{r.prop}</td>
            <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">{r.type}</td>
            <td className="px-4 py-2.5 font-mono text-warning-foreground">{r.default}</td>
            <td className="px-4 py-2.5 text-muted-foreground">{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ============================================================
   COMPONENT SECTIONS
   ============================================================ */

const ButtonsSection = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Section id="buttons" icon={Zap} title="Button" description="Action triggers with 17+ variants, 9 sizes, icon slots, loading state, and grouped layout.">
      <DemoBlock label="Solid variants" code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="dark">Dark</Button>
<Button variant="light">Light</Button>`}>
        <Row>
          {(["primary","secondary","success","danger","warning","info","dark","light"] as const).map(v => (
            <Button key={v} variant={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</Button>
          ))}
        </Row>
      </DemoBlock>

      <DemoBlock label="Outline variants" code={`<Button variant="outline-primary">Primary</Button>
<Button variant="outline-success">Success</Button>
<Button variant="outline-danger">Danger</Button>
<Button variant="outline-warning">Warning</Button>
<Button variant="outline-info">Info</Button>`}>
        <Row>
          {(["outline-primary","outline-success","outline-danger","outline-warning","outline-info"] as const).map(v => (
            <Button key={v} variant={v}>{v.replace("outline-","").charAt(0).toUpperCase()+v.replace("outline-","").slice(1)}</Button>
          ))}
        </Row>
      </DemoBlock>

      <DemoBlock label="Soft / ghost / link" code={`<Button variant="soft-primary">Soft Primary</Button>
<Button variant="soft-success">Soft Success</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}>
        <Row>
          <Button variant="soft-primary">Soft Primary</Button>
          <Button variant="soft-success">Soft Success</Button>
          <Button variant="soft-danger">Soft Danger</Button>
          <Button variant="soft-info">Soft Info</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </Row>
      </DemoBlock>

      <DemoBlock label="Sizes: xs → xxl" code={`<Button size="xs">xs</Button>
<Button size="sm">sm</Button>
<Button size="default">default</Button>
<Button size="lg">lg</Button>
<Button size="xl">xl</Button>
<Button size="xxl">xxl</Button>`}>
        <Row>
          {(["xs","sm","default","lg","xl","xxl"] as const).map(s => (
            <Button key={s} size={s}>Size {s}</Button>
          ))}
        </Row>
      </DemoBlock>

      <DemoBlock label="Icon variants" code={`<Button size="icon" variant="primary"><Bell /></Button>
<Button size="icon-sm" variant="outline-primary"><Search /></Button>
<Button iconStart={<Mail />}>With start icon</Button>
<Button iconEnd={<ArrowRight />}>With end icon</Button>`}>
        <Row>
          <Button size="icon" variant="primary"><Bell className="h-4 w-4" /></Button>
          <Button size="icon-sm" variant="outline-primary"><Search className="h-3.5 w-3.5" /></Button>
          <Button size="icon-lg" variant="soft-success"><Check className="h-5 w-5" /></Button>
          <Button iconStart={<Mail className="h-4 w-4" />}>Email</Button>
          <Button iconEnd={<ArrowRight className="h-4 w-4" />} variant="outline-primary">Next</Button>
          <Button iconStart={<Download className="h-4 w-4" />} iconEnd={<ChevronRight className="h-4 w-4" />} variant="success">Export</Button>
        </Row>
      </DemoBlock>

      <DemoBlock label="States: loading · disabled · block" code={`<Button isLoading>Saving...</Button>
<Button disabled>Disabled</Button>
<Button block>Block button</Button>`}>
        <div className="space-y-2">
          <Row>
            <Button isLoading loadingText="Saving...">Save</Button>
            <Button
              isLoading={loading}
              loadingText="Processing..."
              onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
            >
              {loading ? "Processing..." : "Click to load"}
            </Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline-primary" disabled>Disabled outline</Button>
          </Row>
          <Button block>Block button (full width)</Button>
        </div>
      </DemoBlock>

      <DemoBlock label="Grouped buttons" code={`<ButtonGroup>
  <Button variant="outline-primary">Left</Button>
  <Button variant="outline-primary">Center</Button>
  <Button variant="outline-primary">Right</Button>
</ButtonGroup>`}>
        <Row>
          <ButtonGroup>
            <Button variant="outline-primary">Left</Button>
            <Button variant="outline-primary">Center</Button>
            <Button variant="outline-primary">Right</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="primary" size="sm"><Eye className="h-3.5 w-3.5" /></Button>
            <Button variant="primary" size="sm"><Edit3 className="h-3.5 w-3.5" /></Button>
            <Button variant="danger" size="sm"><Trash2 className="h-3.5 w-3.5" /></Button>
          </ButtonGroup>
        </Row>
      </DemoBlock>

      <PropsTable rows={[
        { prop: "variant", type: "string", default: '"primary"', desc: "Visual style: primary | secondary | success | danger | warning | info | light | dark | outline-* | soft-* | ghost | link" },
        { prop: "size", type: "string", default: '"default"', desc: "xs | sm | default | md | lg | xl | xxl | icon | icon-sm | icon-lg" },
        { prop: "isLoading", type: "boolean", default: "false", desc: "Shows spinner and disables interaction" },
        { prop: "loadingText", type: "string", default: "—", desc: "Text shown while loading (fallback: children)" },
        { prop: "iconStart", type: "ReactNode", default: "—", desc: "Icon rendered before label" },
        { prop: "iconEnd", type: "ReactNode", default: "—", desc: "Icon rendered after label" },
        { prop: "block", type: "boolean", default: "false", desc: "Full-width button" },
        { prop: "type", type: "string", default: '"button"', desc: '"button" | "submit" | "reset" | "link" | "navlink"' },
      ]} />
    </Section>
  );
};

const CardsSection = () => (
  <Section id="cards" icon={Box} title="Card" description="Composable card with header, body, footer slots and 5 elevation levels.">
    <DemoBlock label="Elevation levels" code={`<Card elevation="flat">Flat</Card>
<Card elevation="raised">Raised (default)</Card>
<Card elevation="medium">Medium</Card>
<Card elevation="high">High</Card>`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["flat","raised","medium","high"] as const).map(e => (
          <Card key={e} elevation={e} className="p-4">
            <p className="text-ds-sm font-medium capitalize">{e}</p>
            <p className="text-ds-xs text-muted-foreground mt-1">elevation="{e}"</p>
          </Card>
        ))}
      </div>
    </DemoBlock>

    <DemoBlock label="Full structure: Header · Body · Footer" code={`<Card>
  <CardHeader action={<Badge>New</Badge>} divider onClose={() => {}}>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting description text</CardDescription>
  </CardHeader>
  <CardBody>Main content area</CardBody>
  <CardFooter divider>
    <Button variant="ghost" size="sm">Cancel</Button>
    <Button size="sm">Confirm</Button>
  </CardFooter>
</Card>`}>
      <Card className="max-w-sm">
        <CardHeader action={<Badge variant="soft-primary">New</Badge>} divider onClose={() => {}}>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Supporting description that spans two lines to show truncation behaviour.</CardDescription>
        </CardHeader>
        <CardBody>
          <p className="text-ds-sm text-muted-foreground">
            Main content area. Place any content here — tables, forms, lists, charts, etc.
          </p>
        </CardBody>
        <CardFooter divider>
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button size="sm">Confirm</Button>
        </CardFooter>
      </Card>
    </DemoBlock>

    <DemoBlock label="Accent header · hoverable" code={`<Card hoverable>
  <CardHeader accent divider>
    <CardTitle>Hoverable card</CardTitle>
  </CardHeader>
  <CardBody>Hover me</CardBody>
</Card>`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card hoverable>
          <CardHeader accent divider>
            <CardTitle>Hoverable card</CardTitle>
            <CardDescription>Hover to see shadow lift</CardDescription>
          </CardHeader>
          <CardBody><p className="text-ds-sm text-muted-foreground">Hover this card to see shadow elevation.</p></CardBody>
        </Card>
        <Card elevation="medium">
          <CardHeader divider action={<Button size="icon-sm" variant="ghost"><RefreshCw className="h-3.5 w-3.5" /></Button>}>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardBody className="flex items-center justify-center py-8">
            <p className="text-ds-xxl font-bold text-primary">24,891</p>
          </CardBody>
          <CardFooter divider>
            <p className="text-ds-xs text-success">↑ 12% from last month</p>
          </CardFooter>
        </Card>
      </div>
    </DemoBlock>

    <PropsTable rows={[
      { prop: "elevation", type: "string", default: '"raised"', desc: "flat | raised | medium | high | overlay" },
      { prop: "hoverable", type: "boolean", default: "false", desc: "Lifts shadow on hover" },
      { prop: "CardHeader.divider", type: "boolean", default: "false", desc: "Bottom divider line" },
      { prop: "CardHeader.accent", type: "boolean", default: "false", desc: "Subtle primary tinted background" },
      { prop: "CardHeader.onClose", type: "() => void", default: "—", desc: "Renders a close (×) button" },
      { prop: "CardHeader.action", type: "ReactNode", default: "—", desc: "Right-side slot (badge, icon, buttons)" },
      { prop: "CardFooter.divider", type: "boolean", default: "false", desc: "Top divider line" },
    ]} />
  </Section>
);

const AlertsSection = () => (
  <Section id="alerts" icon={Info} title="Alert" description="Inline feedback messages with auto-icon mapping, dismiss action, and 6 semantic variants.">
    <DemoBlock label="All variants (auto icon)" code={`<Alert variant="primary"><AlertTitle>Primary</AlertTitle><AlertDescription>Info message</AlertDescription></Alert>
<Alert variant="success"><AlertTitle>Success</AlertTitle><AlertDescription>Operation completed</AlertDescription></Alert>
<Alert variant="danger"><AlertTitle>Danger</AlertTitle><AlertDescription>Something went wrong</AlertDescription></Alert>
<Alert variant="warning"><AlertTitle>Warning</AlertTitle><AlertDescription>Proceed with caution</AlertDescription></Alert>
<Alert variant="info"><AlertTitle>Info</AlertTitle><AlertDescription>Helpful context</AlertDescription></Alert>`}>
      <div className="space-y-2">
        {([
          { v: "primary" as const, title: "Primary", desc: "This is a primary informational alert." },
          { v: "success" as const, title: "Success", desc: "Your changes were saved successfully." },
          { v: "danger" as const, title: "Danger", desc: "An error occurred. Please try again." },
          { v: "warning" as const, title: "Warning", desc: "This action cannot be undone." },
          { v: "info" as const, title: "Info", desc: "New version available — refresh to update." },
        ]).map(({ v, title, desc }) => (
          <Alert key={v} variant={v}>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{desc}</AlertDescription>
          </Alert>
        ))}
      </div>
    </DemoBlock>

    <DemoBlock label="Dismissible" code={`<Alert variant="success" onDismiss={() => setVisible(false)}>
  <AlertTitle>Saved!</AlertTitle>
  <AlertDescription>Your profile has been updated.</AlertDescription>
</Alert>`}>
      <Alert variant="success" onDismiss={() => {}}>
        <AlertTitle>Saved!</AlertTitle>
        <AlertDescription>Your profile has been updated successfully.</AlertDescription>
      </Alert>
    </DemoBlock>

    <DemoBlock label="No icon / custom icon" code={`<Alert variant="info" icon={false}>No icon</Alert>
<Alert variant="warning" icon={<Star className="h-4 w-4" />}>Custom icon</Alert>`}>
      <div className="space-y-2">
        <Alert variant="info" icon={false}><AlertDescription>Alert without an icon — pass <code className="font-mono text-xs">icon&#123;false&#125;</code>.</AlertDescription></Alert>
        <Alert variant="warning" icon={<Star className="h-4 w-4" />}><AlertDescription>Custom icon via the <code className="font-mono text-xs">icon</code> prop.</AlertDescription></Alert>
      </div>
    </DemoBlock>

    <PropsTable rows={[
      { prop: "variant", type: "string", default: '"default"', desc: "default | primary | success | danger | warning | info | destructive" },
      { prop: "icon", type: "boolean | ReactNode", default: "true", desc: "true = auto icon, false = none, ReactNode = custom" },
      { prop: "onDismiss", type: "() => void", default: "—", desc: "Renders a dismiss (×) button" },
    ]} />
  </Section>
);

const BadgesSection = () => (
  <Section id="badges" icon={Star} title="Badge" description="Status indicators with 16+ variants across solid, soft, and outline styles.">
    <DemoBlock label="Solid" code={`<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>`}>
      <Row>
        {(["primary","secondary","success","danger","warning","info","dark"] as const).map(v => (
          <Badge key={v} variant={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</Badge>
        ))}
      </Row>
    </DemoBlock>

    <DemoBlock label="Soft / Outline / Dot" code={`<Badge variant="soft-primary">Soft</Badge>
<Badge variant="outline-success">Outline</Badge>
<Badge variant="soft-info" dot>Dot badge</Badge>`}>
      <div className="space-y-2">
        <Row label="Soft">
          {(["soft-primary","soft-success","soft-danger","soft-warning","soft-info"] as const).map(v => (
            <Badge key={v} variant={v}>{v.replace("soft-","")}</Badge>
          ))}
        </Row>
        <Row label="Outline">
          {(["outline","outline-primary","outline-success","outline-danger","outline-warning","outline-info"] as const).map(v => (
            <Badge key={v} variant={v}>{v.replace("outline-","") || "default"}</Badge>
          ))}
        </Row>
        <Row label="Dot indicator">
          <Badge variant="soft-success" dot>Online</Badge>
          <Badge variant="soft-danger" dot>Offline</Badge>
          <Badge variant="soft-warning" dot>Away</Badge>
          <Badge variant="soft-info" dot>Busy</Badge>
        </Row>
      </div>
    </DemoBlock>

    <DemoBlock label="Sizes" code={`<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>`}>
      <Row>
        <Badge size="sm">Small</Badge>
        <Badge size="default">Default</Badge>
        <Badge size="lg">Large</Badge>
      </Row>
    </DemoBlock>

    <PropsTable rows={[
      { prop: "variant", type: "string", default: '"primary"', desc: "primary | secondary | success | danger | warning | info | dark | soft-* | outline | outline-* | destructive" },
      { prop: "size", type: "string", default: '"default"', desc: "sm | default | lg" },
      { prop: "dot", type: "boolean", default: "false", desc: "Prepends a coloured dot indicator" },
    ]} />
  </Section>
);

const FormsSection = () => {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);
  const [radio, setRadio] = useState("a");
  const [radioColor, setRadioColor] = useState("primary");
  return (
    <Section id="forms" icon={Type} title="Form Elements" description="Input, Textarea, Checkbox, and Radio with consistent sizing, states, and color variants.">
      <DemoBlock label="Input — sizes & states" code={`<Input placeholder="Default size" />
<Input size="sm" placeholder="Small" />
<Input size="lg" placeholder="Large" />
<Input error="This field is required" placeholder="Error state" />
<Input placeholder="With icons" iconStart={<Search />} iconEnd={<Check />} />`}>
        <div className="max-w-sm space-y-2">
          <Input placeholder="Default size" />
          <Input size="sm" placeholder="Small (size sm)" />
          <Input size="lg" placeholder="Large (size lg)" />
          <Input error="This field is required." placeholder="Error state" />
          <Input placeholder="With hint" hint="We'll never share your email." type="email" />
          <Input placeholder="With icons" iconStart={<Search className="h-4 w-4" />} iconEnd={<Lock className="h-4 w-4" />} />
          <Input placeholder="Disabled" disabled />
        </div>
      </DemoBlock>

      <DemoBlock label="Textarea" code={`<Textarea placeholder="Enter notes..." />
<Textarea error="Required" placeholder="Error state" />
<Textarea resize="none" placeholder="No resize" />`}>
        <div className="max-w-sm space-y-2">
          <Textarea placeholder="Enter notes (resize vertical)…" />
          <Textarea error="This field is required." placeholder="Error state" />
          <Textarea resize="none" placeholder="resize=none" hint="Fixed height, no resize handle." />
        </div>
      </DemoBlock>

      <DemoBlock label="Checkbox — sizes & color schemes" code={`<Checkbox label="Accept terms" />
<Checkbox colorScheme="success" size="lg" label="Mark complete" />
<Checkbox colorScheme="danger" label="Delete all" />`}>
        <div className="space-y-3">
          <Row label="Sizes">
            <Checkbox size="sm" label="Small" />
            <Checkbox label="Default" />
            <Checkbox size="lg" label="Large" />
            <Checkbox size="xl" label="XL" />
          </Row>
          <Row label="Color schemes">
            {(["primary","success","danger","warning","info"] as const).map(c => (
              <Checkbox key={c} colorScheme={c} checked label={c} />
            ))}
          </Row>
          <Row label="States">
            <Checkbox checked={checked} onCheckedChange={setChecked as (v: boolean | "indeterminate") => void} label="Toggle me" />
            <Checkbox checked="indeterminate" label="Indeterminate" />
            <Checkbox disabled label="Disabled" />
            <Checkbox disabled checked label="Disabled checked" />
          </Row>
        </div>
        
      </DemoBlock>

      <DemoBlock label="Radio Group — sizes & color schemes" code={`<RadioGroup value={radio} onValueChange={setRadio} className="flex gap-4">
  <RadioGroupItem value="a" label="Option A" />
  <RadioGroupItem value="b" label="Option B" />
  <RadioGroupItem value="c" label="Option C" />
</RadioGroup>`}>
        <div className="space-y-4">
          <Row label="Default">
            <RadioGroup value={radio} onValueChange={setRadio} className="flex gap-4">
              <RadioGroupItem value="a" label="Option A" />
              <RadioGroupItem value="b" label="Option B" />
              <RadioGroupItem value="c" label="Option C" />
            </RadioGroup>
          </Row>
          <Row label="Color schemes">
            <RadioGroup value={radioColor} onValueChange={setRadioColor} className="flex flex-wrap gap-4">
              {(["primary","success","danger","warning","info"] as const).map(c => (
                <RadioGroupItem key={c} value={c} colorScheme={c} label={c} />
              ))}
            </RadioGroup>
          </Row>
          <Row label="Sizes">
            <RadioGroup value="" onValueChange={() => {}} className="flex flex-wrap gap-4">
              {(["sm","default","lg","xl"] as const).map(s => (
                <RadioGroupItem key={s} value={s} size={s} label={`Size ${s}`} />
              ))}
            </RadioGroup>
          </Row>
        </div>
      </DemoBlock>

      <PropsTable rows={[
        { prop: "Input.size", type: "string", default: '"default"', desc: "sm | default | lg" },
        { prop: "Input.error", type: "string | boolean", default: "—", desc: "Error text (shown below) or boolean to trigger red border" },
        { prop: "Input.hint", type: "string", default: "—", desc: "Helper text shown when no error" },
        { prop: "Input.iconStart / iconEnd", type: "ReactNode", default: "—", desc: "Icon overlaid inside the input" },
        { prop: "Checkbox.colorScheme", type: "string", default: '"primary"', desc: "primary | success | danger | warning | info" },
        { prop: "Checkbox.size", type: "string", default: '"default"', desc: "sm | default | lg | xl" },
        { prop: "Checkbox.label", type: "string", default: "—", desc: "Renders a label wrapped around the checkbox" },
        { prop: "RadioGroupItem.colorScheme", type: "string", default: '"primary"', desc: "primary | success | danger | warning | info" },
      ]} />
    </Section>
  );
};

const FeedbackSection = () => {
  const [progress, setProgress] = useState(65);
  return (
    <Section id="feedback" icon={Sliders} title="Progress & Spinner" description="Multi-color progress bars (striped, animated, labelled) and size/color spinners.">
      <DemoBlock label="Progress — color schemes" code={`<Progress value={65} colorScheme="primary" />
<Progress value={80} colorScheme="success" />
<Progress value={40} colorScheme="danger" />
<Progress value={55} colorScheme="warning" />
<Progress value={70} colorScheme="info" />`}>
        <div className="space-y-3 max-w-md">
          {(["primary","success","danger","warning","info"] as const).map(c => (
            <div key={c} className="flex items-center gap-3">
              <span className="w-16 text-ds-xs text-muted-foreground capitalize">{c}</span>
              <Progress value={progress} colorScheme={c} className="flex-1" />
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="outline-primary" onClick={() => setProgress(p => Math.max(0, p-10))}>-10%</Button>
            <Button size="sm" variant="outline-primary" onClick={() => setProgress(p => Math.min(100, p+10))}>+10%</Button>
            <span className="text-ds-sm self-center">{progress}%</span>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock label="Sizes · striped · animated · labelled" code={`<Progress value={70} size="xs" />
<Progress value={70} size="lg" striped />
<Progress value={70} size="xl" animated showLabel />`}>
        <div className="space-y-3 max-w-md">
          {(["xs","sm","default","lg","xl"] as const).map(s => (
            <Progress key={s} value={65} size={s} colorScheme="primary" showLabel />
          ))}
          <Progress value={50} size="lg" striped colorScheme="info" showLabel />
          <Progress value={75} size="xl" animated colorScheme="success" showLabel />
        </div>
      </DemoBlock>

      <DemoBlock label="Spinner — colors & sizes" code={`<Spinner colorScheme="primary" />
<Spinner colorScheme="success" size="lg" />
<Spinner colorScheme="danger" size="xl" />`}>
        <div className="space-y-4">
          <Row label="Sizes">
            {(["xs","sm","default","lg","xl","xxl"] as const).map(s => (
              <Spinner key={s} colorScheme="primary" size={s} />
            ))}
          </Row>
          <Row label="Color schemes">
            {(["primary","success","danger","warning","info","secondary"] as const).map(c => (
              <Spinner key={c} colorScheme={c} />
            ))}
          </Row>
        </div>
      </DemoBlock>

      <DemoBlock label="SpinnerOverlay — on a card" code={`<div className="relative">
  <Card><CardBody>Content...</CardBody></Card>
  <SpinnerOverlay label="Loading data..." />
</div>`}>
        <div className="relative w-48 h-24">
          <Card className="h-full">
            <CardBody className="flex items-center justify-center h-full">
              <p className="text-ds-sm text-muted-foreground">Card content</p>
            </CardBody>
          </Card>
          <SpinnerOverlay label="Loading..." size="lg" colorScheme="primary" />
        </div>
      </DemoBlock>

      <PropsTable rows={[
        { prop: "Progress.colorScheme", type: "string", default: '"primary"', desc: "primary | success | danger | warning | info | secondary" },
        { prop: "Progress.size", type: "string", default: '"default"', desc: "xs | sm | default | lg | xl" },
        { prop: "Progress.striped", type: "boolean", default: "false", desc: "Diagonal stripe pattern overlay" },
        { prop: "Progress.animated", type: "boolean", default: "false", desc: "Pulse animation on the indicator" },
        { prop: "Progress.showLabel", type: "boolean", default: "false", desc: "Shows numeric % label beside track" },
        { prop: "Spinner.colorScheme", type: "string", default: '"primary"', desc: "primary | success | danger | warning | info | dark | white | inherit | secondary" },
        { prop: "Spinner.size", type: "string", default: '"default"', desc: "xs | sm | default | lg | xl | xxl" },
        { prop: "Spinner.speed", type: "string", default: '"normal"', desc: "fast | normal | slow" },
      ]} />
    </Section>
  );
};

const OverlaysSection = () => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<"sm"|"default"|"md"|"lg">("default");
  return (
    <Section id="overlays" icon={Layers} title="Dialog & Tooltip" description="Animated modal with backdrop blur and configurable sizes; tooltip with dark/light/primary variants.">
      <DemoBlock label="Dialog sizes" code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogContent size="default">
    <DialogHeader divider>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogBody>Content</DialogBody>
    <DialogFooter divider>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}>
        <Row>
          {(["sm","default","md","lg"] as const).map(s => (
            <Button key={s} variant="outline-primary" size="sm" onClick={() => { setSize(s); setOpen(true); }}>
              Open {s}
            </Button>
          ))}
        </Row>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent size={size}>
            <DialogHeader divider>
              <DialogTitle>Dialog — size "{size}"</DialogTitle>
              <DialogDescription>This dialog uses backdrop-blur overlay, smooth scale-in animation, and structured Header/Body/Footer slots.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="text-ds-sm text-muted-foreground leading-relaxed">
                The body area accepts any content. Use <code className="font-mono text-xs bg-muted px-1 rounded">DialogBody</code> for padding consistency,
                or drop content directly into <code className="font-mono text-xs bg-muted px-1 rounded">DialogContent</code> for full control.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Input placeholder="First name" />
                <Input placeholder="Last name" />
              </div>
            </DialogBody>
            <DialogFooter divider>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoBlock>

      <DemoBlock label="Tooltip variants" code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button>Dark (default)</Button></TooltipTrigger>
    <TooltipContent>Black background, white text</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="outline-primary">Light</Button></TooltipTrigger>
    <TooltipContent variant="light">Light bordered tooltip</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="primary">Primary</Button></TooltipTrigger>
    <TooltipContent variant="primary">Primary coloured</TooltipContent>
  </Tooltip>
</TooltipProvider>`}>
        <TooltipProvider>
          <Row>
            <Tooltip>
              <TooltipTrigger asChild><Button size="sm">Dark (default)</Button></TooltipTrigger>
              <TooltipContent>Black background · white text</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button size="sm" variant="outline-primary">Light</Button></TooltipTrigger>
              <TooltipContent variant="light">Light bordered tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button size="sm" variant="primary">Primary</Button></TooltipTrigger>
              <TooltipContent variant="primary">Primary coloured tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon-sm" variant="ghost"><Info className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent side="right">Tooltip on the right</TooltipContent>
            </Tooltip>
          </Row>
        </TooltipProvider>
      </DemoBlock>

      <PropsTable rows={[
        { prop: "DialogContent.size", type: "string", default: '"default"', desc: "sm | default | md | lg | xl | full" },
        { prop: "DialogContent.hideClose", type: "boolean", default: "false", desc: "Hides the built-in close button" },
        { prop: "DialogHeader.divider", type: "boolean", default: "false", desc: "Bottom divider line" },
        { prop: "DialogFooter.divider", type: "boolean", default: "true", desc: "Top divider line" },
        { prop: "TooltipContent.variant", type: "string", default: '"dark"', desc: "dark | light | primary" },
        { prop: "TooltipContent.side", type: "string", default: '"top"', desc: "top | bottom | left | right" },
        { prop: "TooltipContent.sideOffset", type: "number", default: "6", desc: "Gap between trigger and tooltip (px)" },
      ]} />
    </Section>
  );
};

const CollapseSection = () => (
  <Section id="collapse" icon={ToggleLeft} title="Collapse / Accordion" description="Animated expand/collapse with CSS grid-rows — no inline styles. Supports single or multiple open items.">
    <DemoBlock label="Single mode (default)" code={`<CollapseGroup type="single" defaultOpen="q1">
  <Collapse itemId="q1">
    <CollapseTrigger>What is this library?</CollapseTrigger>
    <CollapseContent>A design system built on TailwindCSS + ShadCN.</CollapseContent>
  </Collapse>
  <Collapse itemId="q2">
    <CollapseTrigger>How do I install it?</CollapseTrigger>
    <CollapseContent>npm install @ippis/app-layout-theme</CollapseContent>
  </Collapse>
</CollapseGroup>`}>
      <CollapseGroup type="single" defaultOpen="q1">
        {[
          { id: "q1", q: "What is this component library?", a: "A production-ready design system built on TailwindCSS, ShadCN UI, and Radix primitives, styled with CSS custom properties for full theming support." },
          { id: "q2", q: "How do I install it?", a: "Run npm install @ippis/app-layout-theme and import the CSS: import '@ippis/app-layout-theme/style.css'" },
          { id: "q3", q: "Does it support dark mode?", a: "Yes. Add the .dark class to <html> or <body> and all tokens automatically switch to the dark palette." },
          { id: "q4", q: "Can I override the theme colors?", a: "Yes. Override any --color-* CSS custom property in your root stylesheet. All components read tokens at runtime." },
        ].map(({ id, q, a }) => (
          <Collapse key={id} itemId={id}>
            <CollapseTrigger>{q}</CollapseTrigger>
            <CollapseContent>{a}</CollapseContent>
          </Collapse>
        ))}
      </CollapseGroup>
    </DemoBlock>

    <DemoBlock label="Multiple mode + ghost variant" code={`<CollapseGroup type="multiple">
  <Collapse itemId="a" variant="ghost">
    <CollapseTrigger icon={<Star />} iconPosition="start">Featured</CollapseTrigger>
    <CollapseContent>...</CollapseContent>
  </Collapse>
</CollapseGroup>`}>
      <CollapseGroup type="multiple">
        {[
          { id: "s1", icon: <Star className="h-4 w-4" />, label: "Featured item", content: "This uses iconPosition='start' and multiple mode — multiple panels can be open simultaneously." },
          { id: "s2", icon: <Globe className="h-4 w-4" />, label: "Internationalisation", content: "All text strings are passed as props, making localisation straightforward." },
          { id: "s3", icon: <Code2 className="h-4 w-4" />, label: "TypeScript", content: "Every component is fully typed with exported interfaces. No @ts-ignore needed." },
        ].map(({ id, icon, label, content }) => (
          <Collapse key={id} itemId={id}>
            <CollapseTrigger icon={icon} iconPosition="start">{label}</CollapseTrigger>
            <CollapseContent>{content}</CollapseContent>
          </Collapse>
        ))}
      </CollapseGroup>
    </DemoBlock>

    <PropsTable rows={[
      { prop: "CollapseGroup.type", type: "string", default: '"single"', desc: '"single" closes others on open; "multiple" allows many open' },
      { prop: "CollapseGroup.defaultOpen", type: "string | string[]", default: "—", desc: "itemId(s) open on first render" },
      { prop: "CollapseGroup.divided", type: "boolean", default: "true", desc: "Adds divider lines between items" },
      { prop: "CollapseGroup.flush", type: "boolean", default: "false", desc: "Removes border and rounded corners" },
      { prop: "Collapse.itemId", type: "string", default: "—", desc: "Required when inside CollapseGroup" },
      { prop: "CollapseTrigger.icon", type: "ReactNode", default: "—", desc: "Custom icon (replaces default chevron)" },
      { prop: "CollapseTrigger.iconPosition", type: "string", default: '"end"', desc: '"start" | "end"' },
    ]} />
  </Section>
);

const ListGroupSection = () => (
  <Section id="lists" icon={Rows3} title="List Group" description="Structured vertical lists with icon, badge, description, action, chevron, and href slots.">
    <DemoBlock label="Basic list" code={`<ListGroup>
  <ListGroupItem icon={<User />} description="Admin" badge={<Badge>Active</Badge>} chevron clickable>
    John Doe
  </ListGroupItem>
</ListGroup>`}>
      <ListGroup className="max-w-sm">
        {[
          { name: "John Doe", role: "Administrator", badge: <Badge variant="soft-success" dot>Active</Badge> },
          { name: "Jane Smith", role: "Editor", badge: <Badge variant="soft-warning" dot>Away</Badge> },
          { name: "Bob Wilson", role: "Viewer", badge: <Badge variant="soft-danger" dot>Offline</Badge> },
        ].map(({ name, role, badge }) => (
          <ListGroupItem
            key={name}
            icon={<User className="h-4 w-4" />}
            description={role}
            badge={badge}
            chevron
            clickable
            onClick={() => {}}
          >
            {name}
          </ListGroupItem>
        ))}
      </ListGroup>
    </DemoBlock>

    <DemoBlock label="Coloured variants" code={`<ListGroupItem variant="success">Success item</ListGroupItem>
<ListGroupItem variant="danger">Danger item</ListGroupItem>
<ListGroupItem variant="info">Info item</ListGroupItem>`}>
      <ListGroup className="max-w-sm" divided>
        <ListGroupItem variant="primary" icon={<Info className="h-4 w-4" />} action={<Button size="xs" variant="soft-primary">View</Button>}>Primary variant</ListGroupItem>
        <ListGroupItem variant="success" icon={<CheckCircle2 className="h-4 w-4" />}>Success variant</ListGroupItem>
        <ListGroupItem variant="danger"  icon={<XCircle className="h-4 w-4" />}>Danger variant</ListGroupItem>
        <ListGroupItem variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>Warning variant</ListGroupItem>
        <ListGroupItem variant="info"    icon={<Info className="h-4 w-4" />}>Info variant</ListGroupItem>
      </ListGroup>
    </DemoBlock>

    <DemoBlock label="Active & disabled states" code={`<ListGroupItem active>Active item</ListGroupItem>
<ListGroupItem disabled>Disabled item</ListGroupItem>`}>
      <ListGroup className="max-w-sm">
        <ListGroupItem clickable onClick={() => {}}>Normal item</ListGroupItem>
        <ListGroupItem active clickable onClick={() => {}}>Active item (selected)</ListGroupItem>
        <ListGroupItem disabled>Disabled item</ListGroupItem>
      </ListGroup>
    </DemoBlock>

    <PropsTable rows={[
      { prop: "ListGroup.flush", type: "boolean", default: "false", desc: "Removes outer border and rounded corners" },
      { prop: "ListGroup.divided", type: "boolean", default: "true", desc: "Adds dividers between items" },
      { prop: "ListGroupItem.variant", type: "string", default: '"default"', desc: "default | primary | success | danger | warning | info" },
      { prop: "ListGroupItem.icon", type: "ReactNode", default: "—", desc: "Leading icon slot" },
      { prop: "ListGroupItem.badge", type: "ReactNode", default: "—", desc: "Right-side badge slot" },
      { prop: "ListGroupItem.action", type: "ReactNode", default: "—", desc: "Right-side action slot (button, link)" },
      { prop: "ListGroupItem.description", type: "string", default: "—", desc: "Muted sub-text below the label" },
      { prop: "ListGroupItem.chevron", type: "boolean", default: "false", desc: "Trailing chevron arrow" },
      { prop: "ListGroupItem.href", type: "string", default: "—", desc: "Renders item as an anchor tag" },
      { prop: "ListGroupItem.active", type: "boolean", default: "false", desc: "Applies active/selected styling" },
      { prop: "ListGroupItem.disabled", type: "boolean", default: "false", desc: "Dims and blocks interaction" },
    ]} />
  </Section>
);

const NavigationSection = () => (
  <Section id="navigation" icon={Navigation} title="Navigation" description="Breadcrumb, Dropdown Menu, and icon reference for building navigation patterns.">
    <DemoBlock label="Breadcrumb" code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Components</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Navigation</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </DemoBlock>

    <DemoBlock label="Dropdown Menu" code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button iconEnd={<ChevronRight />}>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem><Edit3 /> Edit</DropdownMenuItem>
    <DropdownMenuItem><Copy /> Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-danger"><Trash2 /> Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}>
      <TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline-primary" iconEnd={<ChevronRight className="h-4 w-4" />}>Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem><Eye className="h-4 w-4" />View details</DropdownMenuItem>
            <DropdownMenuItem><Edit3 className="h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem><Copy className="h-4 w-4" />Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger focus:bg-danger/10 focus:text-danger">
              <Trash2 className="h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </DemoBlock>

    <DemoBlock label="Lucide icons — import guide" code={`// Direct import (recommended)
import { Check, Bell, User, Settings } from "lucide-react";

// Or via the theme package (namespaced to avoid conflicts)
import { Icons } from "@ippis/app-layout-theme";
// Usage:
<Icons.Check className="h-4 w-4" />
<Icons.Bell className="h-4 w-4" />

// LucideIcon type for prop typing
import type { LucideIcon } from "@ippis/app-layout-theme";
const MyComp = ({ icon: Icon }: { icon: LucideIcon }) => <Icon />;`}>
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
        {[
          ["Check", Check], ["Bell", Bell], ["User", User], ["Settings", Settings],
          ["Mail", Mail], ["Phone", Phone], ["Star", Star], ["Heart", Heart],
          ["Search", Search], ["Filter", Filter], ["Download", Download], ["Upload", Upload],
          ["Edit3", Edit3], ["Trash2", Trash2], ["Eye", Eye], ["Copy", Copy],
          ["Plus", Plus], ["ArrowRight", ArrowRight], ["Globe", Globe], ["Lock", Lock],
        ].map(([name, Icon]) => (
          <TooltipProvider key={name as string}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/60 cursor-default transition-colors">
                  {React.createElement(Icon as React.ElementType, { className: "h-5 w-5 text-muted-foreground" })}
                  <span className="text-[10px] text-muted-foreground leading-none">{name as string}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>{`<Icons.${name} />`}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </DemoBlock>
  </Section>
);

const IconsReferenceSections = () => (
  <Section id="icons" icon={Cpu} title="Icons Reference" description='Lucide React re-exported as Icons namespace. Use import { Icons } from "@ippis/app-layout-theme".'>
    <DemoBlock label="Usage patterns" code={`// Pattern 1 — namespace (from the theme package)
import { Icons } from "@ippis/app-layout-theme";
<Icons.Bell className="h-4 w-4" />
<Icons.ChevronDown className="h-4 w-4" />

// Pattern 2 — direct from lucide-react (no conflicts)
import { Bell, ChevronDown } from "lucide-react";

// Pattern 3 — type for icon props
import type { LucideIcon } from "@ippis/app-layout-theme";
interface Props { icon: LucideIcon }
const Component = ({ icon: Icon }: Props) => <Icon className="h-4 w-4" />;`}>
      <div className="space-y-3">
        <Alert variant="info" icon={<Info className="h-4 w-4" />}>
          <AlertTitle>Why namespaced?</AlertTitle>
          <AlertDescription>
            Lucide exports icons named <code className="font-mono text-xs">Badge</code>, <code className="font-mono text-xs">Calendar</code>, <code className="font-mono text-xs">Command</code>, <code className="font-mono text-xs">Sheet</code>, <code className="font-mono text-xs">Sidebar</code>, and <code className="font-mono text-xs">Table</code> — the same names as our UI components. The <code className="font-mono text-xs">Icons</code> namespace prevents ambiguity.
          </AlertDescription>
        </Alert>
        <Row>
          {[Bell, Star, Heart, Settings, User, Mail, Globe, Lock, Zap, BookOpen, Code2, Layers].map((Icon, i) => (
            <div key={i} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/60 transition-colors">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </Row>
      </div>
    </DemoBlock>
  </Section>
);

/* ============================================================
   SIDEBAR NAVIGATION CONFIG
   ============================================================ */
const SECTIONS = [
  { id: "buttons",    label: "Button",             icon: Zap },
  { id: "cards",      label: "Card",               icon: Box },
  { id: "alerts",     label: "Alert",              icon: Info },
  { id: "badges",     label: "Badge",              icon: Star },
  { id: "forms",      label: "Form Elements",      icon: Type },
  { id: "feedback",   label: "Progress & Spinner", icon: Sliders },
  { id: "overlays",   label: "Dialog & Tooltip",   icon: Layers },
  { id: "collapse",   label: "Collapse",           icon: ToggleLeft },
  { id: "lists",      label: "List Group",         icon: Rows3 },
  { id: "navigation", label: "Navigation",         icon: Navigation },
  { id: "icons",      label: "Icons",              icon: Cpu },
];

const menus: ShellMenuItem[] = [
  { id: "home",     label: "Overview",         icon: Home,          to: "#home" },
  { id: "sep1",     label: "Components",       icon: Palette,       to: "#", children: SECTIONS.map(s => ({ id: s.id, label: s.label, to: `#${s.id}` })) },
];

/* ============================================================
   DEMO APPLICATION
   ============================================================ */
const DemoApp = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "white">("light");
  const [selectedInstitution, setSelectedInstitution] = useState("1");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const institutions = [
    { id: "1", name: "Ministry of Public Service and Labour", acronym: "MIFOTRA" },
    { id: "2", name: "Ministry of Finance and Economic Planning", acronym: "MINECOFIN" },
    { id: "3", name: "Rwanda Social Security Board", acronym: "RSSB" },
  ];

  const quickActions = [
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      tooltip: "View notifications",
      panel: (
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-ds-sm mb-3">Notifications</h3>
          <div className="space-y-2">
            {[
              { text: "New message received", time: "2 minutes ago" },
              { text: "Task assigned to you", time: "1 hour ago" },
              { text: "Report generated", time: "3 hours ago" },
            ].map(({ text, time }) => (
              <div key={text} className="p-2 rounded-lg bg-muted/50 border border-border">
                <p className="text-ds-sm">{text}</p>
                <p className="text-ds-xs text-muted-foreground mt-0.5">{time}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help",
      tooltip: "Get help and support",
      panel: (
        <div className="p-4">
          <h3 className="font-semibold text-ds-sm mb-2">Help & Support</h3>
          <p className="text-ds-sm text-muted-foreground mb-4">
            Need assistance? Contact our support team or check the documentation.
          </p>
          <Button variant="outline-primary" size="sm" block>Contact Support</Button>
        </div>
      ),
      variant: "primary" as const,
    },
  ];

  const appLauncherItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "#" },
    { id: "analytics", label: "Analytics", icon: BarChart, description: "View analytics", href: "#" },
    { id: "documents", label: "Documents", icon: FileText, href: "#" },
  ];

  return (
    <AppShell
      menus={menus}
      title="UI Theme — Component Docs"
      logo={
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-ds-sm font-bold">
            UI
          </span>
          <span className="font-semibold text-ds-sm">AppLayout</span>
        </div>
      }
      user={{
        name: "Developer",
        email: "dev@example.com",
        subtitle: "IPPIS Platform",
        menuItems: [
          { id: "profile",  label: "Profile",      icon: User,    href: "#" },
          { id: "settings", label: "Settings",     icon: Settings, href: "#" },
          { id: "logout",   label: "Sign out",     icon: LogOut,  onSelect: () => {}, danger: true },
        ],
      }}
      institutions={institutions}
      selectedInstitutionId={selectedInstitution}
      onInstitutionChange={setSelectedInstitution}
      showInstitutionSelector
      quickActions={quickActions}
      appLauncherItems={appLauncherItems}
      sidebarHeader={
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-ds-sm font-bold shrink-0">
            UI
          </span>
          <div className="min-w-0">
            <p className="text-ds-sm font-semibold truncate">AppLayout Theme</p>
            <p className="text-ds-xs text-muted-foreground truncate">Component Docs</p>
          </div>
        </div>
      }
      theme={{ initialMode: theme, onModeChange: setTheme }}
      onMenuSelect={(item) => {
        if (item.to?.startsWith("#") && item.to !== "#") scrollTo(item.to.slice(1));
      }}
    >
      {/* ── Page header ──────────────────────────────────── */}
      <div id="home" className="mb-8 scroll-mt-20">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <Palette className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-ds-xxl font-bold text-foreground">Component Library</h1>
            <p className="text-ds-sm text-muted-foreground">@ippis/app-layout-theme · Interactive component showcase</p>
          </div>
        </div>
        <p className="text-ds-md text-muted-foreground max-w-2xl">
          Live demos, props tables, and copy-ready code snippets for every component in the design system.
          Built with TailwindCSS, ShadCN UI, Radix primitives, and CSS custom properties.
        </p>

        {/* Quick-jump nav */}
        <div className="mt-6 flex flex-wrap gap-2">
          {SECTIONS.map(s => (
            <button
              type="button"
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-ds-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Component sections ────────────────────────────── */}
      <div className="space-y-8">
        <ButtonsSection />
        <CardsSection />
        <AlertsSection />
        <BadgesSection />
        <FormsSection />
        <FeedbackSection />
        <OverlaysSection />
        <CollapseSection />
        <ListGroupSection />
        <NavigationSection />
        <IconsReferenceSections />
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="mt-12 border-t border-border pt-6 pb-2 text-center text-ds-xs text-muted-foreground">
        @ippis/app-layout-theme · MIT License · Built with TailwindCSS + ShadCN UI + Radix
      </footer>
    </AppShell>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DemoApp />
    </BrowserRouter>
  </React.StrictMode>
);
