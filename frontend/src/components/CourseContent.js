
import React, { useState } from 'react';
import { Play, FileText, Presentation, CheckCircle } from 'lucide-react';

// Internal Card Components
const Card = ({ className = '', children, ...props }) => (
  <div 
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className = '', children, ...props }) => (
  <div 
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...props }) => (
  <h3 
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Internal Button Component
const Button = ({ className = '', children, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Internal cn utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const CourseContent = ({ content = [], progress = null, onComplete }) => {
  const [activeContent, setActiveContent] = useState(null);

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'presentation':
        return <Presentation className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleComplete = (contentId, event) => {
    event.stopPropagation();
    onComplete?.(contentId);
  };

  const renderContentItem = (item, index) => {
    const isCompleted = progress?.completedContent?.includes(item._id);
    const isActive = activeContent === index;

    return (
      <div
        key={item._id || index}
        className={cn(
          "p-4 rounded-lg cursor-pointer transition-colors",
          isActive ? "bg-purple-50" : "hover:bg-gray-50"
        )}
        onClick={() => setActiveContent(isActive ? null : index)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getContentIcon(item.type)}
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500">
                {item.duration} minutes • {item.type}
              </p>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          )}
        </div>
        
        {isActive && (
          <div className="mt-4">
            {item.type === 'video' && (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={item.url}
                  title={`${item.title} - Course Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full rounded-lg"
                />
              </div>
            )}
            {item.type === 'pdf' && (
              <object
                data={item.url}
                type="application/pdf"
                className="w-full h-[600px] rounded-lg"
                title={`${item.title} - Course PDF`}
              >
                <p>Unable to display PDF. <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Download PDF</a></p>
              </object>
            )}
            {progress && !isCompleted && (
              <Button
                onClick={(e) => handleComplete(item._id, e)}
                className="mt-4"
              >
                Mark as Complete
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {content.map(renderContentItem)}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseContent;