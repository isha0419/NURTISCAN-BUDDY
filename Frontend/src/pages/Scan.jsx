import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  PenLine,
  ScanText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import UploadDropzone from "@/components/UploadDropzone";
import AnalysisResult from "@/components/AnalysisResult";
import { fileToBase64 } from "@/lib/image";
import { aiApi, foodApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const NUTRIENT_FIELDS = [
  { key: "calories", label: "Calories (kcal)" },
  { key: "protein", label: "Protein (g)" },
  { key: "carbs", label: "Carbs (g)" },
  { key: "fats", label: "Fats (g)" },
  { key: "sugar", label: "Sugar (g)" },
  { key: "sodium", label: "Sodium (mg)" },
];

const emptyNutrients = {
  calories: "",
  protein: "",
  carbs: "",
  fats: "",
  sugar: "",
  sodium: "",
};

export default function Scan() {
  const [tab, setTab] = useState("photo");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(null);
  const [ocrDone, setOcrDone] = useState(false);

  const [foodName, setFoodName] = useState("");
  const [nutrients, setNutrients] = useState(emptyNutrients);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const resetResult = () => {
    setResult(null);
    setSaved(false);
    setError("");
  };

  const handleFileSelected = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setOcrDone(false);
    resetResult();
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setOcrDone(false);
    setOcrProgress(null);
  };

  const runOcr = async () => {
    if (!file) return;
    setError("");
    setOcrProgress(0.3); // indeterminate-ish progress since Gemini doesn't stream progress
    try {
      const base64 = await fileToBase64(file);
      const result = await aiApi.scanLabel(base64, 'image/jpeg');

      setNutrients((prev) => ({
        calories: result.calories ?? prev.calories,
        protein: result.protein ?? prev.protein,
        carbs: result.carbs ?? prev.carbs,
        fats: result.fats ?? prev.fats,
        sugar: result.sugar ?? prev.sugar,
        sodium: result.sodium ?? prev.sodium,
      }));
      if (result.foodName && !foodName) setFoodName(result.foodName);
      setOcrDone(true);
    } catch (err) {
      setError(
        "Could not read the label clearly. Try a sharper, well-lit photo, or enter values manually.",
      );
    } finally {
      setOcrProgress(null);
    }
  };

  const handleNutrientChange = (key, value) =>
    setNutrients((prev) => ({ ...prev, [key]: value }));

  const buildNutrientsPayload = () => {
    const payload = {};
    NUTRIENT_FIELDS.forEach(({ key }) => {
      if (nutrients[key] !== "") payload[key] = Number(nutrients[key]);
    });
    return payload;
  };

  const handleAnalyze = async () => {
    if (!foodName.trim()) {
      setError("Give the food a name first.");
      return;
    }
    setError("");
    setAnalyzing(true);
    setSaved(false);
    try {
      const analysis = await aiApi.analyzeFood({
        foodName: foodName.trim(),
        nutrients: buildNutrientsPayload(),
      });
      setResult(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await foodApi.createEntry({
        foodName: foodName.trim(),
        nutrients: buildNutrientsPayload(),
        riskCategory: result?.riskCategory,
        aiSuggestion: result?.suggestion,
        source: tab === "photo" ? "ocr" : "manual",
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Scan a food
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a label photo or enter details manually.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1">
        <TabButton
          active={tab === "photo"}
          onClick={() => setTab("photo")}
          icon={Camera}
        >
          Photo / OCR
        </TabButton>
        <TabButton
          active={tab === "manual"}
          onClick={() => setTab("manual")}
          icon={PenLine}
        >
          Manual entry
        </TabButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {tab === "photo" ? "Upload label photo" : "Enter food details"}
            </CardTitle>
            <CardDescription>
              {tab === "photo"
                ? "We'll scan it with OCR and pull out the nutrition numbers automatically."
                : "Type in the food name and nutrition facts yourself."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {tab === "photo" && (
              <>
                <UploadDropzone
                  onFileSelected={handleFileSelected}
                  preview={preview}
                  onClear={clearFile}
                />
                {file && !ocrDone && (
                  <Button
                    onClick={runOcr}
                    disabled={ocrProgress !== null}
                    className="w-full"
                    variant="secondary"
                  >
                    <ScanText size={16} />
                    {ocrProgress !== null
                      ? "Reading label…"
                      : "Scan label with AI"}
                  </Button>
                )}
                {ocrDone && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm text-primary">
                    <CheckCircle2 size={15} /> Label scanned — review the
                    numbers below.
                  </div>
                )}
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="foodName">Food name</Label>
              <Input
                id="foodName"
                placeholder="e.g. Maggi Noodles"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {NUTRIENT_FIELDS.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label
                    htmlFor={f.key}
                    className="text-xs text-muted-foreground"
                  >
                    {f.label}
                  </Label>
                  <Input
                    id={f.key}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={nutrients[f.key]}
                    onChange={(e) =>
                      handleNutrientChange(f.key, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle size={15} className="shrink-0" /> {error}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full"
            >
              <Sparkles size={16} />
              {analyzing ? "Analyzing…" : "Analyze with AI"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          {!result && (
            <Card className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles size={22} />
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered analysis will appear here, tuned to your medical
                profile.
              </p>
            </Card>
          )}
          {result && (
            <AnalysisResult
              result={result}
              foodName={foodName}
              onSave={handleSave}
              saving={saving}
            />
          )}
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm text-primary"
            >
              <CheckCircle2 size={15} /> Saved to your log.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}
