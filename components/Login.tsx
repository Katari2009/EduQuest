
import React, { useState } from 'react';
import type { User } from '../types';
import { COURSES, APP_NAME } from '../constants';
import { LogoIcon } from './icons/Logo';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState(COURSES[0]);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin({ name, course, profilePic, points: 0, level: 1 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="flex flex-col items-center p-8">
            <LogoIcon className="h-16 w-16 mb-4 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white mb-2">{APP_NAME}</h1>
            <p className="text-slate-400 mb-8">Comienza tu aventura de aprendizaje</p>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                 <div>
                    <label htmlFor="profile-pic" className="block text-sm font-medium text-slate-300 mb-2">Foto de Perfil (Opcional)</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <span className="h-16 w-16 rounded-full overflow-hidden bg-slate-700">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile Preview" className="h-full w-full object-cover" />
                            ) : (
                                <svg className="h-full w-full text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </span>
                        <label htmlFor="profile-pic-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                           <span>Subir foto</span>
                           <input id="profile-pic-upload" name="profile-pic-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Tu Nombre</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        placeholder="Ej. Alex Vera"
                    />
                </div>
                
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-slate-300 mb-2">Selecciona tu Curso</label>
                    <select
                        id="course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        {COURSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                
                <Button type="submit" disabled={!name.trim()} className="w-full">
                   Empezar
                </Button>
            </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
