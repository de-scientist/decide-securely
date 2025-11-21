import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, X, Calendar, Lock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || options.some(opt => !opt) || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Poll created successfully! 🎉");
    setTimeout(() => navigate("/polls"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Create New Poll</h1>
            <p className="text-muted-foreground">
              Set up a transparent, blockchain-backed voting poll
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-8 glass-card space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Choose the next feature for our DAO"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide context and details about this poll..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <Label>Poll Options *</Label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        required
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Option
                  </Button>
                )}
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date & Time *
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date & Time *
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold">Poll Settings</h3>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                     onClick={() => setIsPublic(!isPublic)}>
                  <div className="flex items-center gap-3">
                    {isPublic ? (
                      <Globe className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">
                        {isPublic ? "Public Poll" : "Restricted Poll"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isPublic
                          ? "Anyone can view and vote"
                          : "Only wallet addresses on allowlist can vote"}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-5 w-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                     onClick={() => setIsAnonymous(!isAnonymous)}>
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium">Anonymous Voting</p>
                      <p className="text-sm text-muted-foreground">
                        Hide voter addresses from public view
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-5 w-5"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => navigate("/polls")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Poll
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
