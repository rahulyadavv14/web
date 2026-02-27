import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import DealCard from '../components/DealCard';
import { getDeals, createDeal, updateDeal, deleteDeal, updateDealStage } from '../services/dealService';
import { getLeads } from '../services/leadService';
import { getContacts } from '../services/contactService';
import { getUsers } from '../services/dashboardService';

const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function Deals() {
  const [dealsByStage, setDealsByStage] = useState({});
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Lead',
    linkedLead: '',
    linkedContact: '',
    assignedTo: '',
    expectedCloseDate: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dealsData, leadsData, contactsData, usersData] = await Promise.all([
        getDeals(),
        getLeads({ limit: 100 }),
        getContacts({ limit: 100 }),
        getUsers(),
      ]);

      const grouped = stages.reduce((acc, stage) => {
        acc[stage] = dealsData.data.filter((deal) => deal.stage === stage);
        return acc;
      }, {});

      setDealsByStage(grouped);
      setLeads(leadsData.data);
      setContacts(contactsData.data);
      setUsers(usersData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeStage = findStageByDealId(active.id);
    const overStage = over.id.startsWith('stage-') ? over.id.replace('stage-', '') : findStageByDealId(over.id);

    if (activeStage !== overStage) {
      moveDealBetweenStages(active.id, activeStage, overStage);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeStage = findStageByDealId(active.id);
    const overStage = over.id.startsWith('stage-') ? over.id.replace('stage-', '') : findStageByDealId(over.id);

    if (activeStage !== overStage) {
      try {
        await updateDealStage(active.id, overStage);
      } catch (error) {
        console.error('Error updating deal stage:', error);
        fetchData();
      }
    }
  };

  const findStageByDealId = (dealId) => {
    for (const [stage, deals] of Object.entries(dealsByStage)) {
      if (deals.some((deal) => deal._id === dealId)) {
        return stage;
      }
    }
    return null;
  };

  const moveDealBetweenStages = (dealId, fromStage, toStage) => {
    setDealsByStage((prev) => {
      const deal = prev[fromStage].find((d) => d._id === dealId);
      if (!deal) return prev;

      return {
        ...prev,
        [fromStage]: prev[fromStage].filter((d) => d._id !== dealId),
        [toStage]: [...prev[toStage], { ...deal, stage: toStage }],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeal) {
        await updateDeal(editingDeal._id, formData);
      } else {
        await createDeal(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      linkedLead: deal.linkedLead?._id || '',
      linkedContact: deal.linkedContact?._id || '',
      assignedTo: deal.assignedTo?._id || '',
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting deal:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      value: '',
      stage: 'Lead',
      linkedLead: '',
      linkedContact: '',
      assignedTo: '',
      expectedCloseDate: '',
    });
    setEditingDeal(null);
  };

  const activeDeal = activeId ? Object.values(dealsByStage).flat().find((deal) => deal._id === activeId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600 mt-1">Drag and drop deals between stages</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Deal
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stages.map((stage) => (
            <div key={stage} className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{stage}</h3>
                <span className="text-sm text-gray-500">
                  {dealsByStage[stage]?.length || 0}
                </span>
              </div>
              <SortableContext
                id={`stage-${stage}`}
                items={dealsByStage[stage]?.map((d) => d._id) || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[200px]">
                  {dealsByStage[stage]?.map((deal) => (
                    <DealCard
                      key={deal._id}
                      deal={deal}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <h4 className="font-semibold">{activeDeal.title}</h4>
              <p className="text-green-600 font-semibold">${activeDeal.value?.toLocaleString()}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Linked Lead</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.linkedLead}
              onChange={(e) => setFormData({ ...formData, linkedLead: e.target.value })}
            >
              <option value="">No Lead</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Linked Contact</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.linkedContact}
              onChange={(e) => setFormData({ ...formData, linkedContact: e.target.value })}
            >
              <option value="">No Contact</option>
              {contacts.map((contact) => (
                <option key={contact._id} value={contact._id}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
          />
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingDeal ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
