import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
          <Icon name="MessageCircle" size={32} className="text-primary" />
        </div>
        <div className="text-left">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">
            Welcome to ChatFlow
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect instantly with anyone, anywhere
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-base text-muted-foreground leading-relaxed">
          Start meaningful conversations in seconds. Create your own room for private discussions 
          or join existing communities. No registration required – just enter and chat.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 pt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Shield" size={16} className="text-success" />
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Zap" size={16} className="text-warning" />
          <span>Instant Connection</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Users" size={16} className="text-accent" />
          <span>No Limits</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;