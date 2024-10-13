import { Connection, PublicKey, clusterApiUrl, SystemProgram, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, web3} from '@project-serum/anchor';
import idl from 'target/idl/ownnest_solanaapp.json';
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import '../styles/global.css';

/**
 * @component App
 * @description Main component for the design application.
 * It manages the modal for design submission, state for designs, 
 * and tokenization processes for NFTs on the Solana blockchain.
 */
const App = () => {

  const [isOpen, setIsOpen] = useState(false); // Modal visibility
  const [designs, setDesigns] = useState([]); // Designs submitted by the user
  const [formData, setFormData] = useState({ // Get value of the modal inputs
    user_id: 'd01', // Default User ID for tests
    title: '',
    color: '',
    fabric: '',
    buttons: '',
    imageUrl: ''
  });

  /** 
   * @state isTokenizing - Indicate if the tokenization process is ongoing.
   * @state isTokenized - Indicate if the design has been successfully tokenized.
   */
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [isTokenized, setIsTokenized] = useState(false);
  
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  /**
   * @function handleInputChange
   * @param {Event} e - The input change event.
   * @description Updates the formData state based on user input.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * @function handleTokenize
   * @param {Array} designs - The designs to be tokenized.
   * @description Fetches existing designs for the user and initiates the creation process on Solana.
   */
  const handleTokenize = async (designs) => {
    try {
      setIsTokenizing(true);
      const userId = 'd01';
      const response = await fetch(`/api/registers?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const combinedDesigns = {
          userId: userId,
          designs: data.designs,
        };
  
        await registerOnSolana(combinedDesigns);
        setIsTokenized(true);
      } else {
        console.error('Failed to fetch designs');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsTokenizing(false);
    }
  };

  /**
   * @function registerOnSolana
   * @param {Object} combinedDesigns - Combined design data.
   * @description Handles the creation on the Solana blockchain using the provided design data.
   */
  const registerOnSolana = async (combinedDesigns) => {  
    const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
  
    const secret = Uint8Array.from([/* ...secret key here... */]);
    const wallet = Keypair.fromSecretKey(secret);
  
    // Creating an Anchor provider using the user's wallet.
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    web3.setProvider(provider);
  
    const programId = new PublicKey("public_key_here");
    const program = new Program(idl, programId, provider);
  
    try {
      const designsData = combinedDesigns.designs.map((design) => ({
        title: design.title,
        color: design.color,
        fabric: design.fabric,
        buttons: design.buttons,
        imageUrl: design.imageUrl
      }));
  
      // Prepare the JSON data to be sent to the contract.
      const jsonData = JSON.stringify({ designs: designsData });
  
      // Create a new Keypair for the design account.
      const designAccount = Keypair.generate();
  
      // Creating the transaction that stores the JSON data in the design account.
      const tx = await program.methods
        .storeDesign(jsonData)
        .accounts({
          designAccount: designAccount.publicKey,
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([wallet, designAccount])
        .rpc();
    } catch (error) {
      console.error("Error creating design and storing data:", error);
    }
  };
  
  /**
   * @function handleSubmit
   * @description Handles the form submission, saves the design to the backend, 
   * and updates the local state with the new design.
   */
  const handleSubmit = async () => {
    const success = await saveDesignToBackend(formData);
    
    if (success) {
      const updatedDesigns = [...designs, formData];
      setDesigns(updatedDesigns);
      setFormData({ user_id: 'd01', title: '', color: '', fabric: '', buttons: '', imageUrl: '' });
      closeModal();
    }
  };

  /**
   * @function saveDesignToBackend
   * @param {Object} design - The design object to be saved.
   * @returns {Promise<Boolean>} - Returns true if the design is successfully saved, else false.
   * @description Saves the design object to the backend via a POST request.
   */
  const saveDesignToBackend = async (design) => {
    try {
      const response = await fetch('/api/registers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(design),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        return true;
      } else {
        console.error('Failed to save the design');
        return false;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8 text-purple-500">Fashion Design Registration</h1>
        <button
          onClick={openModal}
          className="px-6 py-3 bg-purple-500 text-black rounded-md hover:bg-purple-600 transition"
        >
          Register
        </button>

        {/* Modal */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="max-w-lg w-full bg-gray-900 p-8 rounded-lg border-2 border-purple-700">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                      Register a New Design
                    </Dialog.Title>

                    <div className="space-y-4">
                      <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-2 border border-purple-500 rounded-md bg-gray-800 text-white"
                      />
                      <input
                        type="text"
                        name="color"
                        placeholder="Color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-2 border border-purple-500 rounded-md bg-gray-800 text-white"
                      />
                      <input
                        type="text"
                        name="fabric"
                        placeholder="Fabric"
                        value={formData.fabric}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-2 border border-purple-500 rounded-md bg-gray-800 text-white"
                      />
                      <input
                        type="text"
                        name="buttons"
                        placeholder="Buttons"
                        value={formData.buttons}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-2 border border-purple-500 rounded-md bg-gray-800 text-white"
                      />
                      <input
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mb-2 border border-purple-500 rounded-md bg-gray-800 text-white"
                      />
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-purple-500 text-black rounded-md hover:bg-purple-600"
                      >
                        Save Design
                      </button>
                      <button onClick={closeModal} className="text-white">
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Display registered designs */}
        <div className="mt-10 text-left max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">Registered Designs:</h2>
          {designs.length === 0 ? (
            <p>No designs registered yet.</p>
          ) : (
            <ul className="space-y-4">
              {designs.map((design, index) => (
                <li key={index} className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-lg font-semibold">{design.title}</h3>
                  <p><strong>Color:</strong> {design.color}</p>
                  <p><strong>Fabric:</strong> {design.fabric}</p>
                  <p><strong>Buttons:</strong> {design.buttons}</p>
                  <p><strong>Image URL:</strong> <a href={design.imageUrl} className="text-blue-400">{design.imageUrl}</a></p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tokenize button */}
        <button
          onClick={() => handleTokenize(designs)}
          className={`mt-6 px-6 py-3 rounded-md ${isTokenizing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          disabled={isTokenizing}
        >
          {isTokenizing ? 'Tokenizing...' : isTokenized ? 'Tokenized' : 'Tokenize'}
        </button>
      </div>
    </div>
  );
};

export default App;