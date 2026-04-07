import React, { useState, useEffect } from 'react';

interface Cake {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  weight: number;
  available: boolean;
}

const AdminDashboard: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Cake, '_id'>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'birthday',
    ingredients: [],
    weight: 1.0,
    available: true
  });

  const [ingredientsInput, setIngredientsInput] = useState('');

  // Fetch all cakes
  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cakes');
      const data = await response.json();
      setCakes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cakes:', error);
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'weight' ? parseFloat(value) : value
    }));
  };

  // Handle ingredients input
  const handleIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredientsInput(e.target.value);
  };

  // Handle image URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.value
    }));
  };

  // Submit form (Add/Edit cake)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert ingredients string to array
    const ingredientsArray = ingredientsInput.split(',').map(i => i.trim()).filter(i => i);
    
    const cakeData = {
      ...formData,
      ingredients: ingredientsArray
    };

    try {
      const url = editingCake 
        ? `http://localhost:5000/api/cakes/${editingCake._id}`
        : 'http://localhost:5000/api/cakes';
      
      const method = editingCake ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cakeData),
      });

      if (response.ok) {
        alert(editingCake ? 'Cake updated successfully!' : 'Cake added successfully!');
        fetchCakes();
        resetForm();
        setShowAddForm(false);
        setEditingCake(null);
      } else {
        alert('Error saving cake');
      }
    } catch (error) {
      console.error('Error saving cake:', error);
      alert('Error saving cake');
    }
  };

  // Edit cake
  const handleEdit = (cake: Cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name,
      description: cake.description,
      price: cake.price,
      image: cake.image,
      category: cake.category,
      ingredients: cake.ingredients,
      weight: cake.weight,
      available: cake.available
    });
    setIngredientsInput(cake.ingredients.join(', '));
    setShowAddForm(true);
  };

  // Delete cake
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cake?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cakes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Cake deleted successfully!');
        fetchCakes();
      } else {
        alert('Error deleting cake');
      }
    } catch (error) {
      console.error('Error deleting cake:', error);
      alert('Error deleting cake');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'birthday',
      ingredients: [],
      weight: 1.0,
      available: true
    });
    setIngredientsInput('');
    setEditingCake(null);
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(!showAddForm);
              }}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
            >
              {showAddForm ? 'Cancel' : 'Add New Cake'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingCake ? 'Edit Cake' : 'Add New Cake'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cake Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                >
                  <option value="birthday">Birthday</option>
                  <option value="wedding">Wedding</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="custom">Custom</option>
                  <option value="pastry">Pastry</option>
                  <option value="dessert">Dessert</option>
                  <option value="savory">Savory</option>
                  <option value="bread">Bread</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleImageChange}
                  placeholder="https://example.com/cake-image.jpg"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={ingredientsInput}
                  onChange={handleIngredientsChange}
                  placeholder="flour, sugar, eggs, butter"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 p-2 border"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Available for sale</label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                >
                  {editingCake ? 'Update Cake' : 'Add Cake'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddForm(false);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cakes List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Cakes ({cakes.length})</h2>
          </div>
          
          {cakes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No cakes found. Add your first cake!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cakes.map((cake) => (
                    <tr key={cake._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={cake.image}
                          alt={cake.name}
                          className="h-16 w-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cake.name}</div>
                        <div className="text-sm text-gray-500">{cake.description.substring(0, 50)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${cake.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                          {cake.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cake.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {cake.available ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(cake)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cake._id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
