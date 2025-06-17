// frontend/src/pages/Resources.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaBook, FaVideo, FaLink, FaSearch } from 'react-icons/fa';

const ResourcesContainer = styled(motion.div)`
  padding: 2rem 1rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 6rem 2rem 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text}aa;
  margin-top: 0.5rem;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.primary};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.scrollTrack};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scrollThumb};
    border-radius: 10px;
  }
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  background: ${({ $active, theme }) => $active ? theme.primary : theme.cardBackground};
  color: ${({ $active, theme }) => $active ? 'white' : theme.text};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ResourceCard = styled(motion.a)`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  height: 100%;
`;

const ResourceIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ type, theme }) => {
    switch(type) {
      case 'dsa': return theme.warning + '33';
      case 'dev': return theme.info + '33';
      case 'book': return theme.success + '33';
      case 'video': return theme.danger + '33';
      default: return theme.primary + '33';
    }
  }};
  color: ${({ type, theme }) => {
    switch(type) {
      case 'dsa': return theme.warning;
      case 'dev': return theme.info;
      case 'book': return theme.success;
      case 'video': return theme.danger;
      default: return theme.primary;
    }
  }};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ResourceTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ResourceDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const ResourceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ResourceTag = styled.span`
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text}aa;
`;

const resources = [
  {
    id: 1,
    title: "LeetCode",
    description: "Platform for practicing coding problems, especially for technical interviews.",
    url: "https://leetcode.com/",
    type: "dsa",
    tags: ["DSA", "Practice", "Interviews"]
  },
  {
    id: 2,
    title: "GeeksforGeeks",
    description: "Computer science portal with tutorials, courses, and coding problems.",
    url: "https://www.geeksforgeeks.org/",
    type: "dsa",
    tags: ["DSA", "Tutorials", "Practice"]
  },
  {
    id: 3,
    title: "MDN Web Docs",
    description: "Comprehensive documentation for web technologies.",
    url: "https://developer.mozilla.org/",
    type: "dev",
    tags: ["Web Development", "Documentation", "HTML", "CSS", "JavaScript"]
  },
  {
    id: 4,
    title: "React Documentation",
    description: "Official documentation for React.js.",
    url: "https://reactjs.org/docs/getting-started.html",
    type: "dev",
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: 5,
    title: "Cracking the Coding Interview",
    description: "Popular book for preparing for technical interviews.",
    url: "https://www.crackingthecodinginterview.com/",
    type: "book",
    tags: ["DSA", "Interviews", "Book"]
  },
  {
    id: 6,
    title: "The Algorithm Design Manual",
    description: "Comprehensive book on algorithms and data structures.",
    url: "http://www.algorist.com/",
    type: "book",
    tags: ["DSA", "Algorithms", "Book"]
  },
  {
    id: 7,
    title: "CS50's Introduction to Computer Science",
    description: "Harvard University's introduction to computer science.",
    url: "https://cs50.harvard.edu/x/",
    type: "video",
    tags: ["Computer Science", "Course", "Video"]
  },
  {
    id: 8,
    title: "Traversy Media",
    description: "YouTube channel with web development tutorials.",
    url: "https://www.youtube.com/c/TraversyMedia",
    type: "video",
    tags: ["Web Development", "Tutorials", "Video"]
  },
  {
    id: 9,
    title: "freeCodeCamp",
    description: "Free coding curriculum with certifications.",
    url: "https://www.freecodecamp.org/",
    type: "dev",
    tags: ["Web Development", "Practice", "Tutorials"]
  },
  {
    id: 10,
    title: "The Odin Project",
    description: "Free full stack curriculum.",
    url: "https://www.theodinproject.com/",
    type: "dev",
    tags: ["Web Development", "Full Stack", "Curriculum"]
  },
  {
    id: 11,
    title: "Visualgo",
    description: "Visualizing data structures and algorithms through animation.",
    url: "https://visualgo.net/",
    type: "dsa",
    tags: ["DSA", "Visualization", "Learning"]
  },
  {
    id: 12,
    title: "Frontend Masters",
    description: "Advanced frontend development courses.",
    url: "https://frontendmasters.com/",
    type: "dev",
    tags: ["Frontend", "Courses", "JavaScript"]
  }
];

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || resource.type === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  const getIcon = (type) => {
    switch(type) {
      case 'dsa': return <FaCode />;
      case 'dev': return <FaLaptopCode />;
      case 'book': return <FaBook />;
      case 'video': return <FaVideo />;
      default: return <FaLink />;
    }
  };

  return (
    <ResourcesContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <PageTitle>Learning Resources</PageTitle>
        <Subtitle>Curated resources to help you on your journey</Subtitle>
      </Header>
      
      
      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput 
          type="text" 
          placeholder="Search resources..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <TabsContainer>
        <Tab 
          $active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Resources
        </Tab>
        <Tab 
          $active={activeTab === 'dsa'} 
          onClick={() => setActiveTab('dsa')}
        >
          <FaCode /> DSA
        </Tab>
        <Tab 
          $active={activeTab === 'dev'} 
          onClick={() => setActiveTab('dev')}
        >
          <FaLaptopCode /> Development
        </Tab>
        <Tab 
          $active={activeTab === 'book'} 
          onClick={() => setActiveTab('book')}
        >
          <FaBook /> Books
        </Tab>
        <Tab 
          $active={activeTab === 'video'} 
          onClick={() => setActiveTab('video')}
        >
          <FaVideo /> Videos & Courses
        </Tab>
      </TabsContainer>
      
      <ResourcesGrid>
        {filteredResources.length > 0 ? (
          filteredResources.map(resource => (
            <ResourceCard 
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ResourceIcon type={resource.type}>
                {getIcon(resource.type)}
              </ResourceIcon>
              <ResourceTitle>{resource.title}</ResourceTitle>
              <ResourceDescription>{resource.description}</ResourceDescription>
              <ResourceTags>
                {resource.tags.map((tag, index) => (
                  <ResourceTag key={index}>{tag}</ResourceTag>
                ))}
              </ResourceTags>
            </ResourceCard>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p>No resources found matching your search criteria.</p>
          </div>
        )}
      </ResourcesGrid>
    </ResourcesContainer>
  );
};

export default Resources;