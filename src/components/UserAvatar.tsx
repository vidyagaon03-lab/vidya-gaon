import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Settings, Languages } from 'lucide-react';

interface User {
  name: string;
  avatar: string;
  role: 'student' | 'teacher';
  language: 'Punjabi' | 'Hindi' | 'English';
  stars: number;
  level: number;
}

const UserAvatar = () => {
  const [user] = useState<User>({
    name: 'Ravi Kumar',
    avatar: '👦',
    role: 'student',
    language: 'Hindi',
    stars: 12,
    level: 3
  });

  const avatarOptions = ['👦', '👧', '🧒', '👶', '🦋', '🐯', '🦁', '🐨'];
  const languages = ['Punjabi', 'Hindi', 'English'] as const;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-auto p-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-primary">
              <AvatarFallback className="text-lg bg-gradient-celebration">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium text-sm">{user.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Level {user.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-star-gold text-star-gold" />
                  <span className="text-xs font-medium">{user.stars}</span>
                </div>
              </div>
            </div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Student Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Info */}
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarFallback className="text-2xl bg-gradient-celebration">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <Badge className="capitalize">{user.role}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-star-gold text-star-gold" />
                  <span className="font-bold text-star-gold">{user.stars}</span>
                </div>
                <p className="text-sm text-muted-foreground">Stars</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-bold text-primary mb-1">Level {user.level}</div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          </Card>

          {/* Avatar Selection */}
          <div>
            <h4 className="font-medium mb-3">Choose Your Avatar</h4>
            <div className="grid grid-cols-4 gap-2">
              {avatarOptions.map((avatar) => (
                <Button
                  key={avatar}
                  variant={user.avatar === avatar ? "default" : "outline"}
                  className="h-12 text-xl"
                  onClick={() => {/* Update avatar */}}
                >
                  {avatar}
                </Button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Language / भाषा / ਭਾਸ਼ਾ
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((language) => (
                <Button
                  key={language}
                  variant={user.language === language ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => {/* Update language */}}
                >
                  {language}
                </Button>
              ))}
            </div>
          </div>

          {/* Achievement Preview */}
          <div>
            <h4 className="font-medium mb-3">Recent Achievements</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-star-gold rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 fill-white text-white" />
                </div>
                <span>Completed first Math lesson</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 fill-white text-white" />
                </div>
                <span>Earned 10 stars milestone</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAvatar;